# Fix: Flashcard Font Size for Desktop View

## Date
May 7, 2026

## Issue Fixed

Flashcard font sizes were too large on desktop/main view, making the text overwhelming and difficult to read. User requested to reduce font sizes and limit text to maximum 2 lines for both Kanji and Hiragana/Katakana.

## Changes Made

### Font Size Adjustments

**File**: `js/display-controller.js` - `renderFront()` method

#### 1. Kanji Font Sizes
**Before**:
- Mobile: `text-4xl` (2.25rem / 36px)
- Small: `text-6xl` (3.75rem / 60px)
- Medium: `text-7xl` (4.5rem / 72px)
- Large: `text-8xl` (6rem / 96px) ← Too large!

**After**:
- Mobile: `text-4xl` (2.25rem / 36px)
- Small: `text-5xl` (3rem / 48px)
- Medium: `text-6xl` (3.75rem / 60px)
- Large: Removed (stops at `text-6xl`)

**Reduction**: Desktop size reduced from 96px to 60px (37.5% smaller)

---

#### 2. Hiragana/Katakana Font Sizes (with Kanji)
**Before**:
- Mobile: `text-2xl` (1.5rem / 24px)
- Small: `text-3xl` (1.875rem / 30px)
- Medium: `text-4xl` (2.25rem / 36px)
- Large: `text-5xl` (3rem / 48px)

**After**:
- Mobile: `text-2xl` (1.5rem / 24px)
- Small: `text-3xl` (1.875rem / 30px)
- Medium: `text-4xl` (2.25rem / 36px)
- Large: Removed (stops at `text-4xl`)

**Reduction**: Desktop size reduced from 48px to 36px (25% smaller)

---

#### 3. Hiragana/Katakana Font Sizes (without Kanji)
**Before**:
- Mobile: `text-4xl` (2.25rem / 36px)
- Small: `text-6xl` (3.75rem / 60px)
- Medium: `text-7xl` (4.5rem / 72px)
- Large: `text-8xl` (6rem / 96px) ← Too large!

**After**:
- Mobile: `text-4xl` (2.25rem / 36px)
- Small: `text-5xl` (3rem / 48px)
- Medium: `text-6xl` (3.75rem / 60px)
- Large: Removed (stops at `text-6xl`)

**Reduction**: Desktop size reduced from 96px to 60px (37.5% smaller)

---

### Line Clamping Adjustments

#### 1. Kanji Line Clamp
**Before**:
- `webkitLineClamp: '3'` (max 3 lines)
- `maxHeight: '9rem'` (144px)

**After**:
- `webkitLineClamp: '2'` (max 2 lines)
- `maxHeight: '6rem'` (96px)

---

#### 2. Hiragana/Katakana Line Clamp (with Kanji)
**Before**:
- `webkitLineClamp: '3'` (max 3 lines)
- `maxHeight: '6rem'` (96px)

**After**:
- `webkitLineClamp: '2'` (max 2 lines)
- `maxHeight: '4rem'` (64px)

---

#### 3. Hiragana/Katakana Line Clamp (without Kanji)
**Before**:
- `webkitLineClamp: '3'` (max 3 lines)
- `maxHeight: '9rem'` (144px)

**After**:
- `webkitLineClamp: '2'` (max 2 lines)
- `maxHeight: '6rem'` (96px)

---

## Visual Comparison

### Before (Desktop)
```
┌─────────────────────────────┐
│                             │
│         食べる物             │  ← 96px (text-8xl)
│      (VERY LARGE!)          │
│                             │
│        たべもの              │  ← 48px (text-5xl)
│                             │
│   👆 Klik untuk melihat     │
└─────────────────────────────┘
```

### After (Desktop)
```
┌─────────────────────────────┐
│                             │
│       食べる物               │  ← 60px (text-6xl)
│     (More readable)         │
│                             │
│       たべもの               │  ← 36px (text-4xl)
│                             │
│   👆 Klik untuk melihat     │
└─────────────────────────────┘
```

---

## Responsive Breakpoints

### Tailwind CSS Breakpoints Used
- **Default** (< 640px): Mobile phones
- **sm** (≥ 640px): Small tablets
- **md** (≥ 768px): Tablets and small laptops
- **lg** (≥ 1024px): Removed - no longer used

### Font Size Progression

#### Kanji
- Mobile: 36px → Small: 48px → Desktop: 60px

#### Hiragana (with Kanji)
- Mobile: 24px → Small: 30px → Desktop: 36px

#### Hiragana (without Kanji)
- Mobile: 36px → Small: 48px → Desktop: 60px

---

## Benefits

1. **Better Readability**: Font sizes are more appropriate for desktop screens
2. **Cleaner Layout**: Text doesn't dominate the entire flashcard
3. **Consistent Spacing**: More balanced white space around text
4. **2-Line Limit**: Prevents text overflow and maintains clean design
5. **Mobile Unchanged**: Mobile experience remains optimal
6. **Professional Look**: More polished and less overwhelming

---

## Testing Checklist

- [x] Kanji font size reduced on desktop
- [x] Hiragana/Katakana font size reduced on desktop
- [x] Text limited to maximum 2 lines
- [x] Mobile view unchanged (still readable)
- [x] Tablet view has intermediate size
- [x] Desktop view has appropriate size
- [x] Text wrapping works correctly
- [x] Line clamping works (shows ellipsis if needed)
- [x] Both light and dark mode look good
- [x] Flashcards with Kanji + Hiragana display correctly
- [x] Flashcards with only Hiragana display correctly
- [x] Long text is properly truncated

---

## Technical Details

### CSS Properties Used
```css
.kanjiDiv {
  max-height: 6rem;           /* 96px - limits height */
  overflow: hidden;            /* Hides overflow text */
  display: -webkit-box;        /* Required for line clamp */
  -webkit-line-clamp: 2;       /* Limits to 2 lines */
  -webkit-box-orient: vertical; /* Required for line clamp */
  line-height: tight;          /* Tighter line spacing */
  word-break: break-words;     /* Breaks long words */
}
```

### Tailwind Classes Removed
- `lg:text-8xl` - Removed from Kanji
- `lg:text-5xl` - Removed from Hiragana (with Kanji)
- `lg:text-8xl` - Removed from Hiragana (without Kanji)

---

## Related Files
- `js/display-controller.js` - Updated `renderFront()` method
- Previous fix: `BUG-FIX-SOURCE-PROGRESS-AND-MOBILE-FONT.md` - Mobile font size fix

---

## Notes

This fix focuses on desktop/main view font sizes. The previous mobile font size fix remains intact and works well. The combination of both fixes provides optimal viewing experience across all device sizes.
