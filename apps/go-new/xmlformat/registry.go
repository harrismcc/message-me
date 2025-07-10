package xmlformat

// GetDefaultTags returns a map of all available tags
func GetDefaultTags() map[string]Tag {
	return map[string]Tag{
		BoldTag.Name:      BoldTag,
		UnderlineTag.Name: UnderlineTag,
		BorderTag.Name:    BorderTag,
		BrTag.Name:        BrTag,
		QRTag.Name:        QRTag,
	}
}