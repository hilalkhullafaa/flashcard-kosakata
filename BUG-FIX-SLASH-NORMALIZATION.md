# Bug Fix: Slash "/" Normalization in Kanji and Hiragana Fields

## Date: Current Session

## Problem Description

Ketika user membuat flashcard dengan karakter "/" dalam field kanji atau hiragana (contoh: "お国/くに", "お名前/名前"), terjadi 2 bug:

### Bug 1: Duplikasi di Progress Tracker
Progress tracker menghitung vocabulary yang sama sebagai item berbeda karena "/" dianggap sebagai bagian dari identifier.

**Contoh**:
- Flashcard 1: Kanji="お国", Hiragana="くに" → Identifier: "お国"
- Flashcard 2: Kanji="お国/くに", Hiragana="くに" → Identifier: "お国/くに"
- Result: Dihitung sebagai 2 vocabulary berbeda (seharusnya 1)

### Bug 2: Validasi Duplikasi Tidak Bekerja
Notifikasi duplikasi tidak muncul karena sistem membandingkan string secara literal.

**Contoh**:
- Existing: Kanji="お国", Hiragana="くに"
- New: Kanji="お国/くに", Hiragana="くに"
- Result: Tidak terdeteksi sebagai duplikat (seharusnya duplikat)

## Root Cause

Sistem membandingkan dan menghitung identifier tanpa normalisasi. String "お国" dan "お国/くに" dianggap berbeda meskipun secara semantik mereka merujuk pada vocabulary yang sama.

## Solution

Implementasi **normalisasi field** yang mengambil hanya bagian pertama sebelum "/" (jika ada) untuk:
1. Pengecekan duplikasi
2. Perhitungan progress tracker

### Normalization Logic

```javascript
normalizeField(value) {
    if (!value) return '';
    const trimmed = value.trim();
    // If contains "/", take only the first part
    if (trimmed.includes('/')) {
        return trimmed.split('/')[0].trim();
    }
    return trimmed;
}
```

**Contoh**:
- Input: "お国/くに" → Output: "お国"
- Input: "お名前/名前" → Output: "お名前"
- Input: "食べる" → Output: "食べる" (tidak berubah)
- Input: "" → Output: ""

## Implementation Details

### 1. FlashcardManager - normalizeField() (NEW)

**File**: `js/flashcard-manager.js`

**Function**:
```javascript
/**
 * Normalize field value for comparison
 * Takes the first part before "/" if exists, and trims whitespace
 * @param {string} value - Value to normalize
 * @returns {string} - Normalized value
 */
normalizeField(value) {
    if (!value) return '';
    const trimmed = value.trim();
    // If contains "/", take only the first part
    if (trimmed.includes('/')) {
        return trimmed.split('/')[0].trim();
    }
    return trimmed;
}
```

### 2. FlashcardManager - checkDuplicates() (MODIFIED)

**Changes**:
```javascript
checkDuplicates(kanji, hiragana, excludeId = null) {
    // Normalize kanji and hiragana (NEW)
    const normalizedKanji = this.normalizeField(kanji);
    const normalizedHiragana = this.normalizeField(hiragana);
    
    const duplicates = this.flashcards.filter(fc => {
        const fcKanji = this.normalizeField(fc.kanji); // Normalize
        const fcHiragana = this.normalizeField(fc.hiragana); // Normalize
        
        // Match if both kanji AND hiragana are the same
        return fcKanji === normalizedKanji && 
               fcHiragana === normalizedHiragana && 
               fc.id !== excludeId;
    });
    
    // ... rest of code
}
```

**Before**:
- "お国" vs "お国/くに" → Not duplicate ❌

**After**:
- "お国" vs "お国/くに" → Duplicate ✅ (both normalized to "お国")

### 3. ProgressTracker - normalizeIdentifier() (NEW)

**File**: `js/progress-tracker.js`

**Function**:
```javascript
/**
 * Normalize identifier for deduplication
 * Takes the first part before "/" if exists
 * @param {string} identifier - Identifier to normalize
 * @returns {string} - Normalized identifier
 */
normalizeIdentifier(identifier) {
    if (!identifier) return '';
    const trimmed = identifier.trim();
    // If contains "/", take only the first part
    if (trimmed.includes('/')) {
        return trimmed.split('/')[0].trim();
    }
    return trimmed;
}
```

### 4. ProgressTracker - calculateProgress() (MODIFIED)

**Changes**:
```javascript
calculateProgress(flashcards, identifierField) {
    // ... existing code ...
    
    for (const flashcard of flashcards) {
        let identifier = flashcard[identifierField];
        
        // Skip empty identifiers
        if (!identifier || identifier.trim() === '') {
            continue;
        }

        // Normalize identifier (NEW)
        identifier = this.normalizeIdentifier(identifier);

        uniqueVocab.add(identifier);
        
        // ... rest of code
    }
    
    // ... rest of code
}
```

**Before**:
- Flashcard 1: "お国" → Counted as 1 vocabulary
- Flashcard 2: "お国/くに" → Counted as 1 vocabulary (different)
- Total: 2 vocabularies ❌

**After**:
- Flashcard 1: "お国" → Normalized to "お国"
- Flashcard 2: "お国/くに" → Normalized to "お国"
- Total: 1 vocabulary ✅

### 5. ProgressTracker - getUniqueIdentifiers() (MODIFIED)

**Changes**:
```javascript
getUniqueIdentifiers(flashcards, fieldName) {
    const identifiers = new Set();

    for (const flashcard of flashcards) {
        let identifier = flashcard[fieldName];

        // Skip empty identifiers
        if (identifier && identifier.trim() !== '') {
            // Normalize identifier (NEW)
            identifier = this.normalizeIdentifier(identifier);
            identifiers.add(identifier);
        }
    }

    return identifiers;
}
```

## Test Cases

### Test Case 1: Duplicate Detection with Slash

**Setup**:
1. Create flashcard: Kanji="お国", Hiragana="くに", Bab 1
2. Try to create: Kanji="お国/くに", Hiragana="くに", Bab 2

**Expected Result**:
- ✅ Duplicate notification appears
- ✅ Shows: "Flashcard dengan kanji お国 dan hiragana/katakana くに sudah ada di Bab 1"

### Test Case 2: Progress Tracker Deduplication

**Setup**:
1. Create flashcard: Kanji="お国", Hiragana="くに", Bab 1
2. Create flashcard: Kanji="お国/くに", Hiragana="くに", Bab 2 (force save)

**Expected Result**:
- ✅ Progress tracker shows 1 vocabulary (not 2)
- ✅ Progress shows both Bab 1 and Bab 2

### Test Case 3: Hiragana with Slash

**Setup**:
1. Create flashcard: Kanji="", Hiragana="こんにちは", Bab 1
2. Try to create: Kanji="", Hiragana="こんにちは/konnichiwa", Bab 2

**Expected Result**:
- ✅ Duplicate notification appears
- ✅ Shows: "Flashcard dengan hiragana/katakana こんにちは sudah ada di Bab 1"

### Test Case 4: No Slash (Normal Case)

**Setup**:
1. Create flashcard: Kanji="食べる", Hiragana="たべる", Bab 1
2. Try to create: Kanji="食べる", Hiragana="たべる", Bab 2

**Expected Result**:
- ✅ Duplicate notification appears (normal behavior, no regression)

### Test Case 5: Different Vocabulary with Slash

**Setup**:
1. Create flashcard: Kanji="お国", Hiragana="くに", Bab 1
2. Try to create: Kanji="お名前/名前", Hiragana="なまえ", Bab 2

**Expected Result**:
- ✅ No duplicate notification (different vocabulary)
- ✅ Flashcard saved successfully

## Benefits

1. **Consistent Behavior**: Vocabulary dengan atau tanpa "/" diperlakukan sama
2. **Accurate Progress**: Progress tracker tidak menghitung duplikasi
3. **Better Duplicate Detection**: Notifikasi duplikasi bekerja dengan benar
4. **User-Friendly**: User bisa menggunakan "/" untuk variasi tanpa masalah
5. **Backward Compatible**: Flashcard tanpa "/" tetap bekerja normal

## Edge Cases Handled

1. **Empty String**: `normalizeField("")` → `""`
2. **Null Value**: `normalizeField(null)` → `""`
3. **Only Slash**: `normalizeField("/")` → `""`
4. **Multiple Slashes**: `normalizeField("お国/くに/kuni")` → `"お国"` (takes first part)
5. **Whitespace**: `normalizeField(" お国 / くに ")` → `"お国"` (trimmed)
6. **No Slash**: `normalizeField("食べる")` → `"食べる"` (unchanged)

## Files Modified

1. `js/flashcard-manager.js`:
   - Added `normalizeField()` method
   - Modified `checkDuplicates()` to use normalization

2. `js/progress-tracker.js`:
   - Added `normalizeIdentifier()` method
   - Modified `calculateProgress()` to use normalization
   - Modified `getUniqueIdentifiers()` to use normalization

## Migration Notes

**No migration needed**. Existing flashcards with "/" will automatically be normalized during:
- Duplicate checking (when creating new flashcard)
- Progress calculation (when viewing progress)

The original data in storage remains unchanged. Normalization happens only during comparison and calculation.

## Conclusion

Bug fix ini memastikan bahwa vocabulary dengan format "A/B" diperlakukan sama dengan "A" untuk tujuan:
- Deteksi duplikasi
- Perhitungan progress

User sekarang bisa menggunakan "/" untuk menunjukkan variasi atau alternatif tanpa menyebabkan masalah duplikasi atau perhitungan progress yang salah.
