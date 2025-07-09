package xmlformat

import (
	"fmt"
	"strings"

	"github.com/kenshaw/escpos"
)

var BorderTag = Tag{
	Name:  "border",
	Open:  nil,
	Close: nil,
	SelfClose: func(p *escpos.Escpos) error {
		p.Write(fmt.Sprintf("%s\n", strings.Repeat("=", DefaultPrinterWidth)))
		return nil
	},
}