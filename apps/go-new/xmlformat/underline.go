package xmlformat

import "github.com/kenshaw/escpos"

var UnderlineTag = Tag{
	Name: "underline",
	Open: func(p *escpos.Escpos, state *FormattedText) error {
		p.SetUnderline(1)
		return nil
	},
	Close: func(p *escpos.Escpos, state *FormattedText) error {
		p.SetUnderline(0)
		return nil
	},
	SelfClose: nil,
}