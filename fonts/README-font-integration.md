# Astronomicon Font Integration

This document explains how the Astronomicon TTL font with planetary and zodiac symbols has been integrated into the Birth Sky application.

## Font Integration Details

1. **Font File Location**:
   - The Astronomicon.ttf font file is located in the `fonts` directory
   - The font is loaded via the `planet-symbols.css` file

2. **Character Mappings**:
   - The application uses specific characters from the Astronomicon font
   - These mappings are defined in the `planet-symbols.js` file

## Astronomicon Character Mappings

The Astronomicon font uses the following character mappings:

### Planetary Symbols
```javascript
const PLANET_SYMBOL_MAP = {
    'sun': 'Q',      // The Sun
    'moon': 'R',     // The Moon
    'mercury': 'S',  // Mercury
    'venus': 'T',    // Venus
    'earth': '>',    // Earth symbol
    'mars': 'U',     // Mars
    'jupiter': 'V',  // Jupiter
    'saturn': 'W',   // Saturn
    'uranus': 'X',   // Placeholder
    'neptune': 'Y',  // Placeholder
    'pluto': 'Z'     // Placeholder
};
```

### Zodiac Symbols
```javascript
const ZODIAC_SYMBOL_MAP = {
    'aries': 'A',        // Aries
    'taurus': 'B',       // Taurus
    'gemini': 'C',       // Gemini
    'cancer': 'D',       // Cancer
    'leo': 'E',          // Leo
    'virgo': 'F',        // Virgo
    'libra': 'G',        // Libra
    'scorpio': 'H',      // Scorpio
    'sagittarius': 'I',  // Sagittarius
    'capricorn': '\\',   // Capricorn
    'aquarius': 'K',     // Aquarius
    'pisces': 'L'        // Pisces
};
```

## Customizing for Different Fonts

If you want to use a different font:

## Font Fallback

The application is designed to fall back to standard Unicode astronomical symbols if the custom font is not available or if a specific symbol is missing. This ensures the application will always display something meaningful.

## Testing Your Font

After placing your font file and updating the character mappings:

1. Refresh the application in your browser
2. The planetary symbols should now display using your custom font
3. If any symbols don't appear correctly, check your character mappings in `planet-symbols.js`

## Font Requirements

For best results, your TTL font should:

- Be a monospaced or symbol font
- Have clear, distinct symbols for each planet
- Be properly encoded with characters in the standard range

## Troubleshooting

If the custom font doesn't display:
- Check that the font file exists in the correct location
- Verify that the font format is supported by modern browsers
- Ensure the character mappings in `planet-symbols.js` match the actual characters in your font
- Check the browser console for any font loading errors
