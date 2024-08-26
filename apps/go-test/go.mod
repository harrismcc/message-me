module example/hello

go 1.22.6

require (
	connectrpc.com/connect v1.16.2
	github.com/harrismcc/example/proto v0.0.0
	github.com/kenshaw/escpos v0.0.0-20221114190919-df06b682a8fc
	golang.org/x/net v0.28.0
)

require (
	github.com/google/go-cmp v0.6.0 // indirect
	golang.org/x/text v0.17.0 // indirect
	google.golang.org/protobuf v1.34.2 // indirect
)

replace github.com/harrismcc/example/proto v0.0.0 => ../../packages/proto/gen/
