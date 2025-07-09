package xmlformat

import (
	"github.com/kenshaw/escpos"
)

var BrTag = Tag{
	Name:  "br",
	Open:  nil,
	Close: nil,
	SelfClose: func(p *escpos.Escpos) error {
		p.Linefeed()
		return nil
	},
}

