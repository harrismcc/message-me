package xmlformat

import "github.com/kenshaw/escpos"

var BoldTag = Tag{
	Name: "bold",
	Open: func(p *escpos.Escpos, state *FormattedText) error {
		p.SetEmphasize(1)
		return nil
	},
	Close: func(p *escpos.Escpos, state *FormattedText) error {
		p.SetEmphasize(0)
		return nil
	},
	SelfClose: nil,
}