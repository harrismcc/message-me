package xmlformat

import (
	"encoding/xml"
	"fmt"
	"strings"

	"github.com/kenshaw/escpos"
)

const DefaultPrinterWidth = 32

type FormattedText struct {
	Content   string
	Bold      bool
	Underline bool
	Border    bool
}


// Parser holds the configuration for XML parsing
type Parser struct {
	tags         map[string]Tag
	printerWidth int
}

// NewParser creates a new XML parser with default handlers
func NewParser() *Parser {
	return &Parser{
		tags:         make(map[string]Tag),
		printerWidth: DefaultPrinterWidth,
	}
}

// NewParserWithDefaults creates a new XML parser with default tag handlers
func NewParserWithDefaults() *Parser {
	p := NewParser()
	for name, tag := range GetDefaultTags() {
		p.tags[name] = tag
	}
	return p
}

// RegisterTag adds a new tag handler
func (p *Parser) RegisterTag(tag Tag) {
	p.tags[tag.Name] = tag
}

// SetPrinterWidth sets the printer width for border calculations
func (p *Parser) SetPrinterWidth(width int) {
	p.printerWidth = width
}

// PrintFormattedContent parses XML content and sends formatted output to the escpos printer
func (p *Parser) PrintFormattedContent(printer *escpos.Escpos, content string) error {
	// First, handle <border /> tags by replacing them with actual borders
	content = strings.ReplaceAll(content, "<border />", "<border></border>")
	
	wrappedContent := "<root>" + content + "</root>"
	decoder := xml.NewDecoder(strings.NewReader(wrappedContent))
	var currentState FormattedText
	
	for {
		token, err := decoder.Token()
		if err != nil {
			break
		}
		
		switch elem := token.(type) {
		case xml.StartElement:
			if tag, exists := p.tags[elem.Name.Local]; exists {
				if tag.SelfClose != nil {
					tag.SelfClose(printer)
				} else if tag.Open != nil {
					tag.Open(printer, &currentState)
				}
			}
			
		case xml.EndElement:
			if tag, exists := p.tags[elem.Name.Local]; exists {
				if tag.Close != nil {
					tag.Close(printer, &currentState)
				}
			}
			
		case xml.CharData:
			text := strings.TrimSpace(string(elem))
			if text != "" {
				// Apply current formatting
				if currentState.Bold {
					printer.SetEmphasize(1)
				}
				if currentState.Underline {
					printer.SetUnderline(1)
				}
				
				printer.Write(fmt.Sprintf("%s\n", text))
				
				if currentState.Bold {
					printer.SetEmphasize(0)
				}
				if currentState.Underline {
					printer.SetUnderline(0)
				}
			}
		}
	}
	
	return nil
}