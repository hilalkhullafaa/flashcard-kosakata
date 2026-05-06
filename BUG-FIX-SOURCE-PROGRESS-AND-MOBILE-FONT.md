# Bug Fix: Source Progress Count & Mobile Font Size

## Date
May 7, 2026

## Issues Fixed

### 1. Incorrect Total Count Per Source
**Problem**: When user adds a flashcard to "IRODORI Beginner Level (A1)", other sources like "IRODORI Basic Level 1 (A1)" and "IRODORI Basic Level 1 (A2)" show incorrect totals (e.g., "0/3" instead of "0/0").

**Root Cause**: The progress tracker was calculating totals across all flashcards instead of filtering by the specific source.

**Solution**: 
- Updated `js/main.js` line 343 to use `ViewContextType.SOURCE` constant instead of string literal `'SOURCE'`
- This ensures the progress tracker correctly filters flashcards by source before calculating totals
- Now each source only shows counts for flashcards that actually belong to that source

**Files Modified**:
- `js/main.js` - Fixed source context type in `createSourceSection()`

**Verification**:
1. Add a flashcard to "IRODORI Beginner Level (A1)"
2. Check other sources like "IRODORI Basic Level 1 (A1)"
3. Verify they show "0/0" instead of incorrect counts

---

### 2. Mobile Font Size Too Large
**Problem**: On mobile view, the Kanji and Hiragana/Katakana text is too large and can overflow beyond 3 lines.

**Root Cause**: Font sizes were too large for mobile screens without proper line clamping.

**Solution**:
- Reduced base font sizes for mobile:
  - Kanji: `text-6xl` → `text-4xl` (mobile), keeping larger sizes for desktop
  - Hiragana (with Kanji): `text-3xl` → `text-2xl` (mobile)
  - Hiragana (without Kanji): `text-6xl` → `text-4xl` (mobile)
- Added CSS line clamping with `-webkit-line-clamp: 3` to limit to maximum 3 lines
- Added `break-words` and `leading-tight` for better text wrapping
- Set `maxHeight` constraints to enforce 3-line limit
- Added `overflow: hidden` to prevent text overflow

**Files Modified**:
- `js/display-controller.js` - Updated `renderFront()` method with responsive font sizes and line clamping

**Verification**:
1. Open the app on mobile view (or resize browser to mobile width)
2. Create flashcards with long Kanji or Hiragana text
3. Verify text is readable and limited to maximum 3 lines
4. Verify text doesn't overflow the flashcard container

---

## Technical Details

### Font Size Progression (Mobile → Desktop)
- **Kanji**: `text-4xl` → `text-6xl` → `text-7xl` → `text-8xl`
- **Hiragana (with Kanji)**: `text-2xl` → `text-3xl` → `text-4xl` → `text-5xl`
- **Hiragana (without Kanji)**: `text-4xl` → `text-6xl` → `text-7xl` → `text-8xl`

### Line Clamping Implementation
```javascript
element.style.display = '-webkit-box';
element.style.webkitLineClamp = '3';
element.style.webkitBoxOrient = 'vertical';
element.style.overflow = 'hidden';
element.style.maxHeight = '9rem'; // ~3 lines
```

---

## Testing Checklist

- [x] Source progress shows correct counts per source
- [x] Adding flashcard to one source doesn't affect other sources' totals
- [x] Mobile font sizes are readable and not too large
- [x] Text is limited to maximum 3 lines on mobile
- [x] Text wraps properly without overflow
- [x] Desktop view maintains larger, readable font sizes
- [x] Line clamping works across different browsers

---

## Related Files
- `js/main.js` - Source section rendering
- `js/display-controller.js` - Flashcard front rendering
- `js/progress-tracker.js` - Progress calculation logic
