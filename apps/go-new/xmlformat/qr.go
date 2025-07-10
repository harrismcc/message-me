package xmlformat

import (
	"encoding/base64"
	"fmt"
	"image/png"
	"bytes"

	"github.com/kenshaw/escpos"
	"github.com/skip2/go-qrcode"
)

var QRTag = Tag{
	Name:  "qr",
	Open:  nil,
	Close: nil,
	SelfClose: func(p *escpos.Escpos) error {
		// This is a placeholder - we need to modify the parser to pass attributes
		// For now, we'll generate a simple QR code with placeholder text
		return printQRCode(p, "https://example.com")
	},
}

func printQRCode(p *escpos.Escpos, data string) error {
	// Generate QR code
	qr, err := qrcode.New(data, qrcode.Medium)
	if err != nil {
		return fmt.Errorf("failed to generate QR code: %w", err)
	}

	// Set size appropriate for thermal printer (typically 256x256 pixels)
	qr.DisableBorder = false
	img := qr.Image(256)

	// Convert image to PNG bytes
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return fmt.Errorf("failed to encode QR code image: %w", err)
	}

	// Convert to base64 for escpos library
	base64Data := base64.StdEncoding.EncodeToString(buf.Bytes())

	// Print the QR code image
	params := map[string]string{
		"width":  "256",
		"height": "256",
	}
	
	p.Image(params, base64Data)

	// Add some spacing after QR code
	p.Linefeed()
	
	return nil
}