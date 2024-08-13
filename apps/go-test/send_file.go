package main

import (
	"fmt"
	"io"
	"os"

	connect "connectrpc.com/connect"
	proto "github.com/harrismcc/example/proto"
)

// `sendFile` takes in a connectrpc server stream and a file path. It reads the file from the filePath
// and sends those bytes over the server stream.
func sendFile(stream *connect.ServerStream[proto.ImageFileResponse], filePath string) error {
	// Open the file
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Create a buffer to read the file in chunks
	buffer := make([]byte, 100*1024) //100KB chunks

	for {
		// Read file into buffer
		n, err := file.Read(buffer)
		if err != nil {
			// Don't throw on eof error
			if err == io.EOF {
				break
			}
			fmt.Printf("File error: %s", err.Error())
			return err
		}
		// Stop sending when file is done
		if n == 0 {
			break
		}

		if err := stream.Send(&proto.ImageFileResponse{ChunkData: buffer[:n]}); err != nil {
			return fmt.Errorf("Send response: %w", err)
		}
	}

	return nil
}
