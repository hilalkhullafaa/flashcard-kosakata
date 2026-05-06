# Fix: Flashcard Back (Meaning) Font Size for Mobile View

## Date
May 7, 2026

## Issue Fixed

The meaning (arti) and romaji text on the back of flashcards were too large on mobile view, causing text to overflow outside the flashcard box. User requested to reduce font sizes and limit text to maximum 2 lines.

## Changes Made

### Font Size Adjustments

**File**: `js/display-controller.js` - `renderBack()` method

#### 1. Meaning (Arti) Font Sizes
**Before**:
- Mobile: `text-3xl` (1.875rem / 30px)
- Small: `text-4xl` (2.25rem / 36px)
- Medium: `text-5xl` (3rem / 48px)

**After**:
- Mobile: `text-2xl` (1.5rem / 24px) ✅ Reduced by 20%
- Small: `text-3xl` (1.875rem / 30px) ✅ Reduced by 16.7%
- Medium: `text-4xl` (2.25rem / 36px) ✅ Reduced by 25%

**Reduction**: 
- Mobile: 30px → 24px (20% smaller)
- Desktop: 48px → 36px (25% smaller)

---

#### 2. Romaji Font Sizes
**Before**:
- Mobile: `text-xl` (1.25rem / 20px)
- Small: `text-2xl` (1.5rem / 24px)
- Medium: `text-3xl` (1.875rem / 30px)

**After**:
- Mobile: `text-lg` (1.125rem / 18px) ✅ Reduced by 10%
- Small: `text-xl` (1.25rem / 20px) ✅ Reduced by 16.7%
- Medium: `text-2xl` (1.5rem / 24px) ✅ Reduced by 20%

**Reduction**:
- Mobile: 20px → 18px (10% smaller)
- Desktop: 30px → 24px (20% smaller)

---

### Line Clamping Added

#### 1. Meaning Line Clamp
**Added**:
- `webkitLineClamp: '2'` (max 2 lines)
- `maxHeight: '4rem'` (64px)
- `overflow: hidden`
- `display: -webkit-box`
- `break-words` for proper word wrapping
- `leading-tight` for tighter line spacing

**Effect**: Long meanings will be truncated with ellipsis (...) after 2 lines

---

#### 2. Romaji Line Clamp
**Added**:
- `webkitLineClamp: '2'` (max 2 lines)
- `maxHeight: '3rem'` (48px)
- `overflow: hidden`
- `display: -webkit-box`
- `break-words` for proper word wrapping
- `leading-tight` for tighter line spacing

**Effect**: Long romaji will be truncated with ellipsis (...) after 2 lines

---

## Visual Comparison

### Before (Mobile - Back Side)
```
┌─────────────────────────────┐
│                             │
│   Makanan yang enak         │  ← 30px (text-3xl)
│   sekali dan lezat          │     Overflows!
│   untuk dimakan             │
│                             │
│   taberumonogaoishii        │  ← 20px (text-xl)
│   kutetabetai               │     Overflows!
│                             │
│   📚 IRODORI Pemula         │
│   📖 Bab 1                  │
│                             │
│ [✓ Sudah] [✗ Belum]        │
└─────────────────────────────┘
     Text overflows box! ❌
```

### After (Mobile - Back Side)
```
┌─────────────────────────────┐
│                             │
│   Makanan yang enak...      │  ← 24px (text-2xl)
│                             │     Max 2 lines ✅
│                             │
│   taberumonogaoish...       │  ← 18px (text-lg)
│                             │     Max 2 lines ✅
│                             │
│   📚 IRODORI Pemula         │
│   📖 Bab 1                  │
│                             │
│ [✓ Sudah] [✗ Belum]        │
└─────────────────────────────┘
     Fits perfectly! ✅
```

---

## Responsive Breakpoints

### Font Size Progression

#### Meaning (Arti)
- Mobile (< 640px): 24px
- Small (≥ 640px): 30px
- Desktop (≥ 768px): 36px

#### Romaji
- Mobile (< 640px): 18px
- Small (≥ 640px): 20px
- Desktop (≥ 768px): 24px

---

## Benefits

1. **No Overflow**: Text stays within flashcard boundaries on mobile
2. **Better Readability**: Smaller font is easier to read on small screens
3. **Cleaner Layout**: More balanced spacing between elements
4. **2-Line Limit**: Prevents text from dominating the flashcard
5. **Consistent Design**: Matches the front side's 2-line limit
6. **Professional Look**: More polished and organized appearance
7. **Responsive**: Scales appropriately across all device sizes

---

## Technical Details

### CSS Properties Applied

**Meaning**:
```css
.meaningDiv {
  font-size: text-2xl (mobile) → text-4xl (desktop);
  max-height: 4rem;              /* 64px - limits height */
  overflow: hidden;              /* Hides overflow text */
  display: -webkit-box;          /* Required for line clamp */
  -webkit-line-clamp: 2;         /* Limits to 2 lines */
  -webkit-box-orient: vertical;  /* Required for line clamp */
  line-height: tight;            /* Tighter line spacing */
  word-break: break-words;       /* Breaks long words */
}
```

**Romaji**:
```css
.romajiDiv {
  font-size: text-lg (mobile) → text-2xl (desktop);
  max-height: 3rem;              /* 48px - limits height */
  overflow: hidden;              /* Hides overflow text */
  display: -webkit-box;          /* Required for line clamp */
  -webkit-line-clamp: 2;         /* Limits to 2 lines */
  -webkit-box-orient: vertical;  /* Required for line clamp */
  line-height: tight;            /* Tighter line spacing */
  word-break: break-words;       /* Breaks long words */
}
```

---

## Testing Checklist

- [x] Meaning font size reduced on mobile
- [x] Romaji font size reduced on mobile
- [x] Text limited to maximum 2 lines
- [x] No text overflow on mobile
- [x] Ellipsis (...) appears for long text
- [x] Desktop view has appropriate size
- [x] Tablet view has intermediate size
- [x] Text wrapping works correctly
- [x] Line clamping works properly
- [x] Both light and dark mode look good
- [x] Buttons still visible and accessible
- [x] Source and chapter info still readable
- [x] Overall layout is balanced

---

## Related Fixes

This fix complements previous font size adjustments:

1. **BUG-FIX-SOURCE-PROGRESS-AND-MOBILE-FONT.md**
   - Fixed front side (Kanji/Hiragana) mobile font sizes
   - Limited to 3 lines

2. **FIX-FLASHCARD-FONT-SIZE-DESKTOP.md**
   - Fixed front side desktop font sizes
   - Limited to 2 lines

3. **FIX-FLASHCARD-BACK-FONT-SIZE-MOBILE.md** (This fix)
   - Fixed back side (Meaning/Romaji) mobile font sizes
   - Limited to 2 lines

---

## Summary of All Font Sizes

### Front Side (Kanji/Hiragana)
- Mobile: 36px → Desktop: 60px
- Max lines: 2

### Back Side (Meaning)
- Mobile: 24px → Desktop: 36px
- Max lines: 2

### Back Side (Romaji)
- Mobile: 18px → Desktop: 24px
- Max lines: 2

All text now fits properly within flashcard boundaries across all device sizes! ✅

---

## Related Files
- `js/display-controller.js` - Updated `renderBack()` method
- Previous fixes:
  - `BUG-FIX-SOURCE-PROGRESS-AND-MOBILE-FONT.md`
  - `FIX-FLASHCARD-FONT-SIZE-DESKTOP.md`
