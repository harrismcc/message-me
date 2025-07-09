package xmlformat

import "github.com/kenshaw/escpos"

type Tag struct {
	Name      string
	Open      func(p *escpos.Escpos, state *FormattedText) error
	Close     func(p *escpos.Escpos, state *FormattedText) error
	SelfClose func(p *escpos.Escpos) error
}