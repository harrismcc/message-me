module thermal-server

go 1.22.6

require (
	github.com/joho/godotenv v1.5.1
	github.com/kenshaw/escpos v0.0.0-20221114190919-df06b682a8fc
	github.com/skip2/go-qrcode v0.0.0-20200617195104-da1b6568686e
)

replace github.com/harrismcc/example/proto v0.0.0 => ../../packages/proto/gen/
