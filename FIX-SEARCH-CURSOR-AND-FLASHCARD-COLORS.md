# Fix: Search Cursor Issue & Flashcard Color Scheme

## Date
May 7, 2026

## Issues Fixed

### Issue 1: Search Input Cursor Problem
**Problem**: 
- When typing in search field, cursor would jump out after each character
- User had to click back into the field to continue typing
- When deleting characters, cursor would lose focus
- Very frustrating user experience

**Root Cause**: 
- The `showSearchResults()` method was clearing and re-rendering the entire view with `mainView.innerHTML = ''`
- This destroyed the search input element and created a new one
- The new input lost focus and cursor position

---

### Issue 2: Flashcard Hiragana/Katakana Color
**Problem**:
- Hiragana/Katakana text was blue (`text-blue-600`) in light mode
- Hiragana/Katakana text was light blue (`text-blue-400`) in dark mode
- User requested white in dark mode and dark gray (not too dark) in light mode

---

## Changes Made

### 1. Search Cursor Fix
**File**: `js/main.js` - `showSearchResults()` method

**Before**:
```javascript
showSearchResults(results, query) {
    const mainView = document.getElementById('main-view');
    if (!mainView) return;

    mainView.innerHTML = '';

    // Keep search input
    const header = this.createHeader();
    mainView.appendChild(header);
    
    // Set search input value
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = query;
    }
    // ... rest of code
}
```

**After**:
```javascript
showSearchResults(results, query) {
    const mainView = document.getElementById('main-view');
    if (!mainView) return;

    // Save cursor position before clearing
    const searchInput = document.getElementById('search-input');
    const cursorPosition = searchInput ? searchInput.selectionStart : 0;

    mainView.innerHTML = '';

    // Keep search input
    const header = this.createHeader();
    mainView.appendChild(header);
    
    // Restore search input value and cursor position
    const newSearchInput = document.getElementById('search-input');
    if (newSearchInput) {
        newSearchInput.value = query;
        // Restore cursor position after a short delay to ensure DOM is ready
        setTimeout(() => {
            newSearchInput.setSelectionRange(cursorPosition, cursorPosition);
            newSearchInput.focus();
        }, 0);
    }
    // ... rest of code
}
```

**Key Changes**:
1. ✅ Save cursor position before clearing DOM: `searchInput.selectionStart`
2. ✅ Restore cursor position after re-render: `setSelectionRange(cursorPosition, cursorPosition)`
3. ✅ Restore focus: `newSearchInput.focus()`
4. ✅ Use `setTimeout(..., 0)` to ensure DOM is ready before setting cursor

---

### 2. Flashcard Hiragana/Katakana Color Fix
**File**: `js/display-controller.js` - `renderFront()` method

**Before**:
```javascript
hiraganaDiv.className = flashcard.kanji 
    ? 'text-2xl sm:text-3xl md:text-4xl font-medium text-blue-600 dark:text-blue-400 ...' 
    : 'text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 ...';
```

**After**:
```javascript
hiraganaDiv.className = flashcard.kanji 
    ? 'text-2xl sm:text-3xl md:text-4xl font-medium text-gray-700 dark:text-white ...' 
    : 'text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700 dark:text-white ...';
```

**Color Changes**:
- Light mode: `text-blue-600` → `text-gray-700` (dark gray, not too dark)
- Dark mode: `text-blue-400` → `text-white` (pure white)

---

### 3. Guessing Game Hiragana Color Fix
**File**: `js/main.js` - `renderGuessingGameCard()` method

**Before**:
```javascript
hiraganaText.className = 'text-lg sm:text-2xl md:text-3xl text-blue-600 dark:text-blue-400 ...';
```

**After**:
```javascript
hiraganaText.className = 'text-lg sm:text-2xl md:text-3xl text-gray-700 dark:text-white ...';
```

**Color Changes**:
- Light mode: `text-blue-600` → `text-gray-700`
- Dark mode: `text-blue-400` → `text-white`

---

## Technical Details

### Cursor Position Preservation

**How it works**:
1. Before clearing DOM, get cursor position: `selectionStart` property
2. Clear and re-render DOM
3. After re-render, restore cursor position: `setSelectionRange(start, end)`
4. Restore focus: `focus()` method
5. Use `setTimeout(..., 0)` to defer execution until DOM is ready

**Why setTimeout(0)?**
- Ensures the new input element is fully rendered in the DOM
- Allows browser to complete the render cycle
- Prevents race conditions where cursor is set before element is ready

---

### Color Scheme

#### Tailwind CSS Colors Used

**Light Mode**:
- `text-gray-700` = `#374151` (RGB: 55, 65, 81)
- Not too dark, good contrast on white background
- Professional and readable

**Dark Mode**:
- `text-white` = `#FFFFFF` (RGB: 255, 255, 255)
- Pure white for maximum contrast on dark background
- Clean and modern look

---

## Visual Comparison

### Search Input Behavior

**Before**:
```
User types: "t"
→ Cursor jumps out ❌
User clicks back in field
User types: "a"
→ Cursor jumps out again ❌
User clicks back in field
User types: "b"
→ Cursor jumps out again ❌
Very frustrating!
```

**After**:
```
User types: "tab"
→ Cursor stays in place ✅
User continues typing smoothly
→ No interruptions ✅
Perfect experience!
```

---

### Flashcard Colors

**Before (Light Mode)**:
```
┌─────────────────────────────┐
│                             │
│         食べる物             │  ← Black (Kanji)
│                             │
│        たべもの              │  ← Blue ❌
│                             │
└─────────────────────────────┘
```

**After (Light Mode)**:
```
┌─────────────────────────────┐
│                             │
│         食べる物             │  ← Black (Kanji)
│                             │
│        たべもの              │  ← Dark Gray ✅
│                             │
└─────────────────────────────┘
```

**Before (Dark Mode)**:
```
┌─────────────────────────────┐
│                             │
│         食べる物             │  ← White (Kanji)
│                             │
│        たべもの              │  ← Light Blue ❌
│                             │
└─────────────────────────────┘
```

**After (Dark Mode)**:
```
┌─────────────────────────────┐
│                             │
│         食べる物             │  ← White (Kanji)
│                             │
│        たべもの              │  ← White ✅
│                             │
└─────────────────────────────┘
```

---

## Benefits

### Search Fix
1. **Smooth Typing**: No interruptions while typing
2. **Better UX**: Cursor stays where user expects
3. **No Re-clicking**: User doesn't need to click back into field
4. **Natural Feel**: Behaves like standard input fields
5. **Works for Deletion**: Cursor stays in place when deleting characters

### Color Fix
1. **Better Contrast**: Dark gray on white is easier to read than blue
2. **Consistent Dark Mode**: White text matches kanji color
3. **Professional Look**: More neutral color scheme
4. **Less Distracting**: Blue was too bright and attention-grabbing
5. **Unified Design**: Kanji and Hiragana now have similar visual weight

---

## Testing Checklist

### Search
- [x] Cursor stays in place when typing
- [x] Cursor stays in place when deleting
- [x] Focus remains on input field
- [x] Cursor position is correct after each character
- [x] Works with fast typing
- [x] Works with backspace/delete
- [x] Works with arrow keys
- [x] Debouncing still works (300ms delay)

### Colors
- [x] Hiragana is dark gray in light mode
- [x] Hiragana is white in dark mode
- [x] Kanji remains black/white (unchanged)
- [x] Colors work in flashcard view
- [x] Colors work in guessing game
- [x] Good contrast in both modes
- [x] Readable on all backgrounds

---

## Related Files
- `js/main.js` - Search cursor fix and guessing game color fix
- `js/display-controller.js` - Flashcard color fix

---

## Notes

The cursor position preservation technique is a common pattern for maintaining user input state across DOM re-renders. The `setTimeout(..., 0)` is crucial for ensuring the DOM is ready before manipulating the input element.

The color change from blue to gray/white provides a more neutral and professional appearance while maintaining excellent readability in both light and dark modes.
