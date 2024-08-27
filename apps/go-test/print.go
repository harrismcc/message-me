package main

import (
	"bufio"
	"fmt"
	"os"

	"github.com/kenshaw/escpos"
)

func printMessage(title string, body string, timeStamp string) error {
	f, err := os.OpenFile("/dev/serial0", os.O_RDWR, 0)
	if err != nil {
		return err
	}
	defer f.Close()

	r := bufio.NewReader(f)
	w := bufio.NewWriter(f)
	rw := bufio.NewReadWriter(r, w)
	p := escpos.New(rw)

	p.Init()

	p.SetUnderline(1)
	p.SetEmphasize(1)
	p.Write(fmt.Sprintf("From: %s\n", title))
	p.SetEmphasize(0)
	p.SetUnderline(0)

	p.SetFont("B")
	p.Write(fmt.Sprintf("%s\n\n", timeStamp))
	p.SetFont("A")

	p.Write(fmt.Sprintf("%s\n", body))

	p.FormfeedN(3)

	p.End()
	w.Flush()

	return nil
}
