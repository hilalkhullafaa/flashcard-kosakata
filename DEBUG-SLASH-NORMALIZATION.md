# Debug: Slash Normalization Issue

## Problem Report
User melaporkan bahwa:
1. Ketika mengetik kanji/hiragana dengan tanda "/" seperti "onamae/namae"
2. Tidak ada notifikasi duplikasi meskipun kosakata sudah ada
3. Progress tracker menghitung sebagai kosakata berbeda (duplikasi)

## Debug Steps Added

### 1. Added Console Logging in `flashcard-manager.js`
File: `js/flashcard-manager.js` - Method: `checkDuplicates()`

**Logs yang ditambahkan:**
- Input values (kanji, hiragana)
- Normalized values
- Match results for each flashcard comparison
- Total duplicates found

### 2. Added Console Logging in `progress-tracker.js`
File: `js/progress-tracker.js` - Method: `calculateProgress()`

**Logs yang ditambahkan:**
- Total flashcards being processed
- Original identifier → Normalized identifier
- Unique vocabulary count
- Remembered vocabulary count

## How to Test

### Test Case: "onamae/namae" Duplicate Detection

1. **Open Browser Console** (F12 → Console tab)

2. **Create First Flashcard:**
   - Kanji: `onamae`
   - Hiragana: `namae`
   - Meaning: `name`
   - Romaji: `namae`
   - Source: `IRODORI 1`
   - Chapter: `1`
   - Click **Save**

3. **Create Second Flashcard (should trigger duplicate):**
   - Kanji: `onamae/namae`
   - Hiragana: `namae`
   - Meaning: `name`
   - Romaji: `namae`
   - Source: `IRODORI 1`
   - Chapter: `2`
   - Click **Save**

4. **Check Console Logs:**
   Look for logs like:
   ```
   [Duplicate Check] Input: { kanji: "onamae/namae", hiragana: "namae" }
   [Duplicate Check] Normalized: { normalizedKanji: "namae|onamae", normalizedHiragana: "namae" }
   [Duplicate Check] MATCH FOUND: ...
   [Duplicate Check] Total duplicates found: 1
   ```

5. **Expected Result:**
   - ✅ Duplicate notification should appear
   - ✅ Console shows "Total duplicates found: 1"

### Test Case: Progress Tracker

1. **After creating flashcards, check Progress Tracker**

2. **Check Console Logs:**
   Look for logs like:
   ```
   [Progress Tracker] Calculating progress for hiragana, total flashcards: 2
   [Progress Tracker] hiragana: "namae" → normalized: "namae"
   [Progress Tracker] hiragana: "namae" → normalized: "namae"
   [Progress Tracker] Unique hiragana vocabulary: 1
   ```

3. **Expected Result:**
   - ✅ Progress shows 1 unique vocabulary (not 2)
   - ✅ Console shows correct normalization

## What to Look For

### ✅ CORRECT Behavior:
```
Input: "onamae/namae"
Normalized: "namae|onamae"

Input: "namae/onamae"
Normalized: "namae|onamae"

Result: DUPLICATE DETECTED ✅
```

### ❌ INCORRECT Behavior:
```
Input: "onamae/namae"
Normalized: "onamae"  ← WRONG! Should be "namae|onamae"

Input: "namae/onamae"
Normalized: "namae"  ← WRONG! Should be "namae|onamae"

Result: NO DUPLICATE ❌
```

## Possible Issues to Check

### Issue 1: Normalization Function Not Called
**Symptom:** Console shows original value, not normalized
**Solution:** Check if `normalizeField()` is being called correctly

### Issue 2: Case Sensitivity
**Symptom:** "Onamae" vs "onamae" treated as different
**Solution:** May need to add `.toLowerCase()` to normalization

### Issue 3: Special Characters
**Symptom:** Different slash characters (/, ／, ＼)
**Solution:** Normalize all slash types to standard "/"

### Issue 4: Whitespace Issues
**Symptom:** "onamae / namae" vs "onamae/namae" treated as different
**Solution:** Already handled by `.trim()` on each part

## Next Steps

1. **Run the test cases above**
2. **Copy console logs** and share them
3. **Take screenshot** of:
   - The duplicate notification (or lack thereof)
   - The progress tracker showing counts
   - The browser console with logs

4. **Report findings:**
   - Did duplicate notification appear?
   - What do console logs show?
   - What does progress tracker show?

## Expected Console Output (Correct Behavior)

```javascript
// When creating "onamae/namae" and "onamae" already exists:
[Duplicate Check] Input: { kanji: "onamae/namae", hiragana: "namae" }
[Duplicate Check] Normalized: { normalizedKanji: "namae|onamae", normalizedHiragana: "namae" }
[Duplicate Check] MATCH FOUND: {
  existing: { kanji: "onamae", hiragana: "namae" },
  normalized: { fcKanji: "onamae", fcHiragana: "namae" }
}
[Duplicate Check] Total duplicates found: 0  ← Should be 0 because "onamae" ≠ "namae|onamae"

// When creating "namae/onamae" and "onamae/namae" already exists:
[Duplicate Check] Input: { kanji: "namae/onamae", hiragana: "test" }
[Duplicate Check] Normalized: { normalizedKanji: "namae|onamae", normalizedHiragana: "test" }
[Duplicate Check] MATCH FOUND: {
  existing: { kanji: "onamae/namae", hiragana: "test" },
  normalized: { fcKanji: "namae|onamae", fcHiragana: "test" }
}
[Duplicate Check] Total duplicates found: 1  ← Should be 1 because both normalize to "namae|onamae"
```

## Date
May 10, 2026
