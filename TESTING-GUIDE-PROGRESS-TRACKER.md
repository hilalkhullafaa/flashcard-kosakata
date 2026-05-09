# Testing Guide: Progress Tracker Sources & Chapters Display

## Date
May 10, 2026

## Purpose
This guide helps verify that the Progress Tracker "Lihat Detail" feature correctly displays all sources and chapters for remembered vocabulary.

---

## Prerequisites

1. **Browser with Developer Tools** (Chrome, Firefox, Edge, etc.)
2. **Application running** (open `index.html` in browser)
3. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

---

## Test Scenario 1: Single Source, Single Chapter

### Setup
1. Add a flashcard:
   - Kanji: 今日は
   - Hiragana: こんにちは
   - Meaning: Hello
   - Romaji: konnichiwa
   - Source: IRODORI Beginner Level (A1)
   - Chapters: 1

2. View the flashcard and mark it as "Sudah Ingat" (✓)

### Expected Result
In Progress Tracker → Lihat Detail:
```
#1
今日は
こんにちは
Hello

📚 Sumber: IRODORI Beginner Level (A1)
📖 Bab: 1
```

### Console Output
```
[Progress Tracker] Vocabulary: こんにちは {
  chapters: [1],
  sources: ["IRODORI Beginner Level (A1)"],
  meaning: "Hello"
}

[Display] Rendering vocabulary: こんにちは {
  sources: ["IRODORI Beginner Level (A1)"],
  chapters: [1],
  hasSources: true
}
```

---

## Test Scenario 2: Single Source, Multiple Chapters

### Setup
1. Add flashcard #1:
   - Hiragana: こんにちは
   - Source: IRODORI Beginner Level (A1)
   - Chapters: 1

2. Add flashcard #2 (same vocabulary, different chapter):
   - Hiragana: こんにちは
   - Source: IRODORI Beginner Level (A1)
   - Chapters: 3

3. Mark both as "Sudah Ingat"

### Expected Result
In Progress Tracker → Lihat Detail:
```
#1
こんにちは
Hello

📚 Sumber: IRODORI Beginner Level (A1)
📖 Bab: 1, 3
```

### Console Output
```
[Progress Tracker] Vocabulary: こんにちは {
  chapters: [1, 3],
  sources: ["IRODORI Beginner Level (A1)"],
  meaning: "Hello"
}
```

---

## Test Scenario 3: Multiple Sources, Multiple Chapters

### Setup
1. Add flashcard #1:
   - Hiragana: こんにちは
   - Source: IRODORI Beginner Level (A1)
   - Chapters: 1

2. Add flashcard #2 (same vocabulary, different source):
   - Hiragana: こんにちは
   - Source: IRODORI Basic Level 1 (A1)
   - Chapters: 2

3. Add flashcard #3 (same vocabulary, another chapter):
   - Hiragana: こんにちは
   - Source: IRODORI Basic Level 1 (A2)
   - Chapters: 3

4. Mark all as "Sudah Ingat"

### Expected Result
In Progress Tracker → Lihat Detail:
```
#1
こんにちは
Hello

📚 Sumber: IRODORI Beginner Level (A1) | IRODORI Basic Level 1 (A1) | IRODORI Basic Level 1 (A2)
📖 Bab: 1, 2, 3
```

### Console Output
```
[Progress Tracker] Vocabulary: こんにちは {
  chapters: [1, 2, 3],
  sources: ["IRODORI Beginner Level (A1)", "IRODORI Basic Level 1 (A1)", "IRODORI Basic Level 1 (A2)"],
  meaning: "Hello"
}
```

---

## Test Scenario 4: Kanji Vocabulary

### Setup
1. Add flashcard:
   - Kanji: 今日は
   - Hiragana: こんにちは
   - Meaning: Hello
   - Source: IRODORI Beginner Level (A1)
   - Chapters: 1, 2

2. Mark as "Sudah Ingat"

3. Check **Kanji Progress Card** (not Hiragana)

### Expected Result
In Kanji Progress Tracker → Lihat Detail:
```
#1
今日は
こんにちは
Hello

📚 Sumber: IRODORI Beginner Level (A1)
📖 Bab: 1, 2
```

---

## Debugging Steps

### Step 1: Open Developer Console
- **Windows/Linux**: Press `F12` or `Ctrl+Shift+I`
- **Mac**: Press `Cmd+Option+I`

### Step 2: Navigate to Console Tab
- Click on "Console" tab in Developer Tools

### Step 3: Clear Console
- Click the 🚫 icon or press `Ctrl+L` to clear old logs

### Step 4: Trigger the View
1. Go to main page
2. Find a progress card (Hiragana or Kanji)
3. Click "Lihat Detail" button

### Step 5: Check Console Logs
Look for these log patterns:

#### ✅ Success Pattern
```
[Progress Tracker] Vocabulary: こんにちは {
  chapters: [1, 2],
  sources: ["IRODORI Beginner Level (A1)"],
  meaning: "Hello"
}

[Display] Rendering vocabulary: こんにちは {
  sources: ["IRODORI Beginner Level (A1)"],
  chapters: [1, 2],
  hasSources: true
}
```

#### ⚠️ Warning Pattern (Missing Sources)
```
[Display] No sources found for vocabulary: こんにちは
```

#### ⚠️ Warning Pattern (Missing Chapters)
```
[Display] No chapters found for vocabulary: こんにちは
```

---

## Common Issues & Solutions

### Issue 1: "Lihat Detail" Button Not Showing
**Cause**: No vocabulary marked as "Sudah Ingat"

**Solution**:
1. View a flashcard
2. Click "✓ Sudah Ingat" button
3. Return to main page
4. Check progress card again

---

### Issue 2: Empty List in "Lihat Detail"
**Cause**: No remembered vocabulary in current context

**Solution**:
- Check if you're looking at the correct progress card (Hiragana vs Kanji)
- Verify flashcards are marked as remembered
- Check console for data collection logs

---

### Issue 3: Sources Not Displaying
**Cause**: Possible data structure issue or old cached code

**Solution**:
1. **Hard refresh**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Clear cache**:
   - Open DevTools → Application → Storage → Clear site data
3. **Check console** for warning messages
4. **Verify data structure** in localStorage:
   - DevTools → Application → Local Storage → file://
   - Look for `flashcards` key
   - Verify each flashcard has `source` field

---

### Issue 4: Chapters Not Displaying
**Cause**: Flashcard missing `chapters` array

**Solution**:
1. Check localStorage data structure
2. Verify flashcards have `chapters: [1, 2, 3]` format
3. Re-add flashcards if necessary

---

## Data Structure Verification

### Check localStorage
1. Open DevTools → Application → Local Storage
2. Find `flashcards` key
3. Verify structure:

```json
[
  {
    "id": "fc_1234567890_abc123",
    "kanji": "今日は",
    "hiragana": "こんにちは",
    "meaning": "Hello",
    "romaji": "konnichiwa",
    "source": "IRODORI Beginner Level (A1)",
    "chapters": [1, 2],
    "memoryStatus": true,
    "createdAt": 1234567890000,
    "updatedAt": 1234567890000
  }
]
```

### Required Fields
- ✅ `source` (string)
- ✅ `chapters` (array of numbers)
- ✅ `hiragana` (string)
- ✅ `memoryStatus` (boolean)

---

## Expected Behavior Summary

| Scenario | Sources Display | Chapters Display |
|----------|----------------|------------------|
| 1 source, 1 chapter | Single source name | Single chapter number |
| 1 source, multiple chapters | Single source name | Comma-separated chapters |
| Multiple sources, 1 chapter each | Pipe-separated sources | Comma-separated chapters |
| Multiple sources, multiple chapters | Pipe-separated sources | Comma-separated chapters (sorted) |

---

## Reporting Issues

If the issue persists after following this guide, please provide:

1. **Console logs** (copy all `[Progress Tracker]` and `[Display]` logs)
2. **localStorage data** (copy the `flashcards` value)
3. **Screenshots** of the "Lihat Detail" view
4. **Browser and version** (e.g., Chrome 120, Firefox 121)
5. **Steps to reproduce** the issue

---

## Success Criteria

✅ Sources display with 📚 icon
✅ Multiple sources separated by ` | `
✅ Chapters display with 📖 icon
✅ Multiple chapters separated by `, `
✅ Chapters sorted in ascending order
✅ No console errors or warnings
✅ Data persists after page reload

---

## Files Involved

- `js/progress-tracker.js` - Data collection logic
- `js/main.js` - Display rendering logic
- `js/flashcard-model.js` - Data structure definitions
- `js/storage-manager.js` - localStorage operations

---

## Additional Notes

- The "Lihat Detail" feature uses a two-pass approach to collect complete data
- First pass: Collects all chapters and sources for each vocabulary
- Second pass: Builds the display list with complete information
- Deduplication is based on Hiragana/Katakana field
- Memory status must be `true` for vocabulary to appear in the list
