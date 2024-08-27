package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"

	connect "connectrpc.com/connect"
	proto "github.com/harrismcc/example/proto"
	"github.com/harrismcc/example/proto/protoconnect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

// TODO: This should be defined by the env vars
const address = "0.0.0.0:8080"

// The print lock mutex. Used to make sure two print jobs aren't sent at the same time
var printLock sync.Mutex

func main() {
	mux := http.NewServeMux()
	path, handler := protoconnect.NewThermalPrinterServiceHandler(&thermalServer{})
	mux.Handle(path, handler)
	fmt.Println("... Listening on", address)
	http.ListenAndServe(
		address,
		// Use h2c so we can serve HTTP/2 without TLS.
		h2c.NewHandler(mux, &http2.Server{}),
	)
}

type thermalServer struct {
	protoconnect.UnimplementedThermalPrinterServiceHandler
}

func (s *thermalServer) PrintText(
	ctx context.Context,
	req *connect.Request[proto.PrintTextRequest],
) (*connect.Response[proto.PrintResponse], error) {
	log.Println("Got a new request to print text!", req.Msg)

	printLock.Lock()
	defer printLock.Unlock()

	_, err := http.Post("https://ntfy.sh/harris-thermal-printer-test", "text/plain", strings.NewReader(req.Msg.Body))

	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// Call the print function
	err = printMessage(req.Msg.Sender, req.Msg.Body, req.Msg.TimeStamp)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&proto.PrintResponse{
		Success: true,
	}), nil
}

func (s *thermalServer) TakePicture(
	ctx context.Context,
	req *connect.Request[proto.Empty],
	stream *connect.ServerStream[proto.ImageFileResponse],
) error {

	err := sendFile(stream, "/Users/harris/Downloads/1GB.bin")
	if err != nil {
		return err
	}

	return nil
}
