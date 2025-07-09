package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Print("No .env file found")
	}

	fmt.Println("Hello, world!")

	err = printMessage("message1")
	err = printMessage("message2")
	if err != nil {
		fmt.Println("Error printing message", err)
	}

}
