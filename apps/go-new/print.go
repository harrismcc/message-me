package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"time"

	"thermal-server/xmlformat"

	"github.com/kenshaw/escpos"
)

const PRINTER_WIDTH = 32

func wrapText(text string, width int) []string {
	if len(text) <= width {
		return []string{text}
	}

	var lines []string
	words := strings.Fields(text)
	currentLine := ""

	for _, word := range words {
		// If adding this word would exceed width, start a new line
		if len(currentLine)+len(word)+1 > width {
			if currentLine != "" {
				lines = append(lines, currentLine)
				currentLine = word
			} else {
				// Single word is too long, break it
				for len(word) > width {
					lines = append(lines, word[:width])
					word = word[width:]
				}
				currentLine = word
			}
		} else {
			if currentLine == "" {
				currentLine = word
			} else {
				currentLine += " " + word
			}
		}
	}

	if currentLine != "" {
		lines = append(lines, currentLine)
	}

	return lines
}

func centerText(text string, width int) string {
	lines := wrapText(text, width)
	var centeredLines []string

	for _, line := range lines {
		if len(line) >= width {
			centeredLines = append(centeredLines, line)
		} else {
			padding := width - len(line)
			leftPad := padding / 2
			rightPad := padding - leftPad
			centeredLines = append(centeredLines, strings.Repeat(" ", leftPad)+line+strings.Repeat(" ", rightPad))
		}
	}

	return strings.Join(centeredLines, "\n")
}

func printMessage(body string) error {
	serialPort := os.Getenv("SERIAL_PORT")
	if serialPort == "" {
		serialPort = "/dev/serial0" // default
	}

	f, err := os.OpenFile(serialPort, os.O_RDWR, 0)
	if err != nil {
		// For testing, print to stdout instead
		return printToStdout(body)
	}
	defer f.Close()

	r := bufio.NewReader(f)
	w := bufio.NewWriter(f)
	rw := bufio.NewReadWriter(r, w)
	p := escpos.New(rw)

	// Create XML parser with default handlers
	parser := xmlformat.NewParserWithDefaults()
	parser.SetPrinterWidth(PRINTER_WIDTH)

	// Print the XML formatted content
	err = parser.PrintFormattedContent(p, body)
	if err != nil {
		return err
	}

	p.FormfeedN(3)

	// Properly flush and close
	w.Flush()

	// Add delay to ensure printer processes the job completely
	time.Sleep(1000 * time.Millisecond)

	return nil
}

func printToStdout(body string) error {
	fmt.Printf("Would print: %s\n", body)
	return nil
}
