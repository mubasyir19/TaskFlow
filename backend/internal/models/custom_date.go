package models

import (
	"fmt"
	"time"
)

type CustomDate time.Time

func (cd *CustomDate) UnmarshalJSON(b []byte) error {
	s := string(b)
	s = s[1 : len(s)-1] // remove quotes

	// Handle berbagai format
	formats := []string{
		"2006-01-02",
		"2006-01-02T15:04:05Z",
		time.RFC3339,
	}

	for _, format := range formats {
		t, err := time.Parse(format, s)
		if err == nil {
			*cd = CustomDate(t)
			return nil
		}
	}

	return fmt.Errorf("invalid date format: %s", s)
}

func (cd CustomDate) Time() time.Time {
	return time.Time(cd)
}
