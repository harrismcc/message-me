module thermal-server

go 1.22.6

require (
	github.com/joho/godotenv v1.5.1
	github.com/kenshaw/escpos v0.0.0-20221114190919-df06b682a8fc
)

replace github.com/harrismcc/example/proto v0.0.0 => ../../packages/proto/gen/
