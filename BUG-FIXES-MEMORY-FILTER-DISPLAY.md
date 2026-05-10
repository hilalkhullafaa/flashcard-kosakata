# Bug Fixes - Memory Status, Filter Name, and Display

## Date: Current Session

### Bug 1: Auto-Checklist Memory Status Tidak Sinkron ✅

**Status**: Fixed

**Deskripsi Masalah**:
Ketika user mengklik "Sudah Ingat" pada 1 kosakata di Bab 1, lalu kosakata yang sama muncul lagi di Bab 3, tombol "Sudah Ingat" tidak otomatis terceklis pada flashcard di Bab 3.

**Root Cause**:
Memory status tidak disinkronkan saat flashcard dimuat dari storage. Setiap flashcard instance memiliki memory status sendiri, meskipun mereka memiliki hiragana/katakana yang sama.

**Solusi**:
Menambahkan fungsi `syncMemoryStatus()` yang dipanggil setiap kali flashcard dimuat dari storage. Fungsi ini:
1. Mengelompokkan flashcard berdasarkan hiragana/katakana
2. Untuk setiap grup, jika ada satu flashcard yang sudah diingat, maka semua flashcard dalam grup tersebut akan ditandai sebagai sudah diingat
3. Memastikan memory status konsisten di seluruh aplikasi

**File yang Dimodifikasi**:
- `js/flashcard-manager.js`

**Perubahan**:
```javascript
/**
 * Load flashcards from storage
 */
loadFlashcards() {
    try {
        const data = storageManager.loadFlashcards();
        this.flashcards = data.map(item => Flashcard.fromJSON(item));
        
        // Sync memory status across flashcards with same hiragana
        this.syncMemoryStatus();
    } catch (error) {
        console.error('Error loading flashcards:', error);
        this.flashcards = [];
    }
}

/**
 * Sync memory status across all flashcards with the same Hiragana/Katakana
 * Ensures that if any flashcard with a specific hiragana is remembered,
 * all flashcards with that hiragana are marked as remembered
 */
syncMemoryStatus() {
    // Group flashcards by hiragana
    const hiraganaGroups = new Map();
    
    this.flashcards.forEach(flashcard => {
        if (!hiraganaGroups.has(flashcard.hiragana)) {
            hiraganaGroups.set(flashcard.hiragana, []);
        }
        hiraganaGroups.get(flashcard.hiragana).push(flashcard);
    });
    
    // For each group, if any flashcard is remembered, mark all as remembered
    hiraganaGroups.forEach((group, hiragana) => {
        const hasRemembered = group.some(fc => fc.memoryStatus === true);
        
        if (hasRemembered) {
            group.forEach(fc => {
                fc.memoryStatus = true;
            });
        }
    });
}
```

**Cara Kerja**:
1. Saat aplikasi dimuat, `loadFlashcards()` dipanggil
2. Setelah flashcard dimuat dari storage, `syncMemoryStatus()` dipanggil
3. Fungsi ini mengelompokkan semua flashcard berdasarkan hiragana
4. Jika ada flashcard dalam grup yang memiliki `memoryStatus = true`, maka semua flashcard dalam grup tersebut akan diset `memoryStatus = true`
5. Hasilnya, badge checklist (✓) akan muncul di semua flashcard dengan hiragana yang sama

**Testing**:
1. Buka flashcard di Bab 1
2. Klik "Sudah Ingat" pada satu kosakata
3. Buka Bab 3 yang memiliki kosakata yang sama
4. Verifikasi badge checklist (✓) muncul di pojok kanan atas flashcard
5. Verifikasi tombol "Sudah Ingat" sudah dalam keadaan aktif (warna kuning)

---

### Bug 2: Nama Filter "Hiragana Only" → "Hirakana Only" ✅

**Status**: Fixed

**Deskripsi Masalah**:
Nama filter menampilkan "Hiragana Only" tetapi user ingin mengubahnya menjadi "Hirakana Only".

**Solusi**:
Mengubah display name di fungsi `getFilterDisplayName()` dari "Hiragana Only" menjadi "Hirakana Only".

**File yang Dimodifikasi**:
- `js/filter-engine.js`

**Perubahan**:
```javascript
getFilterDisplayName(filterType) {
    switch (filterType) {
        case FilterType.HIRAGANA_ONLY:
            return 'Hirakana Only'; // Changed from 'Hiragana Only'
        case FilterType.KANJI:
            return 'Kanji Only';
        case FilterType.ALL:
        default:
            return 'All';
    }
}
```

**Testing**:
1. Buka flashcard view
2. Lihat dropdown filter
3. Verifikasi opsi menampilkan "Hirakana Only" (bukan "Hiragana Only")

---

### Bug 3: Filter "All" - Tampilkan Kanji dan Hiragana di Bagian Depan ✅

**Status**: Fixed

**Deskripsi Masalah**:
Ketika filter diset ke "All", bagian depan flashcard hanya menampilkan kanji saja. User ingin melihat kanji DAN hiragana/katakana di bawahnya pada bagian depan flashcard.

**Solusi**:
Memodifikasi fungsi `renderFront()` untuk:
1. Menerima parameter `currentFilter`
2. Ketika filter adalah "all" dan flashcard memiliki kanji, tampilkan kanji di atas dan hiragana di bawahnya
3. Ketika filter bukan "all" (misalnya "kanji" atau "hirakana"), tampilkan hanya kanji seperti sebelumnya

**File yang Dimodifikasi**:
- `js/display-controller.js` - `renderFront()` method
- `js/display-controller.js` - `createFlashcardElement()` method
- `js/main.js` - `renderCurrentFlashcard()` method

**Perubahan**:

1. **renderFront()** - Menambahkan parameter filter dan logika tampilan:
```javascript
renderFront(flashcard, context, currentFilter = 'all') {
    // ... existing code ...
    
    // Display logic based on filter and kanji availability
    if (flashcard.kanji && flashcard.kanji.trim() !== '') {
        // Kanji display
        const kanjiDiv = document.createElement('div');
        kanjiDiv.className = 'text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white break-words leading-snug';
        // ... styling code ...
        kanjiDiv.textContent = flashcard.kanji;
        frontDiv.appendChild(kanjiDiv);
        
        // Show hiragana below kanji ONLY when filter is "all"
        if (currentFilter === 'all') {
            const hiraganaSubDiv = document.createElement('div');
            hiraganaSubDiv.className = 'text-lg sm:text-xl md:text-2xl font-medium text-blue-600 dark:text-blue-400 mt-2 break-words leading-snug';
            hiraganaSubDiv.textContent = flashcard.hiragana;
            frontDiv.appendChild(hiraganaSubDiv);
        }
    } else {
        // Hiragana/Katakana display (only if no kanji)
        // ... existing code ...
    }
}
```

2. **createFlashcardElement()** - Menambahkan parameter filter:
```javascript
createFlashcardElement(flashcard, context, onMemoryStatusChange = null, currentFilter = 'all') {
    // ... existing code ...
    
    // Render front and back with current filter
    const front = this.renderFront(flashcard, context, currentFilter);
    const back = this.renderBack(flashcard, context, onMemoryStatusChange);
    
    // ... rest of code ...
}
```

3. **renderCurrentFlashcard()** - Meneruskan filter saat ini:
```javascript
const flashcardEl = displayController.createFlashcardElement(
    flashcard, 
    displayController.currentContext,
    (action) => {
        // Auto-navigate to next flashcard after memory status change
        setTimeout(() => {
            this.nextFlashcard();
        }, 250);
    },
    filterEngine.getCurrentFilter() // Pass current filter
);
```

**Cara Kerja**:
1. Saat flashcard dirender, filter saat ini diambil dari `filterEngine.getCurrentFilter()`
2. Filter diteruskan ke `createFlashcardElement()` → `renderFront()`
3. Di `renderFront()`:
   - Jika flashcard memiliki kanji DAN filter adalah "all":
     - Tampilkan kanji (besar, bold)
     - Tampilkan hiragana di bawahnya (sedang, biru)
   - Jika flashcard memiliki kanji DAN filter bukan "all":
     - Tampilkan hanya kanji (seperti sebelumnya)
   - Jika flashcard tidak memiliki kanji:
     - Tampilkan hiragana (besar, bold)

**Styling**:
- Kanji: `text-2xl sm:text-4xl md:text-5xl` (24px → 36px → 48px)
- Hiragana (di bawah kanji): `text-lg sm:text-xl md:text-2xl` (18px → 20px → 24px)
- Warna hiragana: `text-blue-600 dark:text-blue-400` (biru untuk kontras)

**Testing**:
1. Buka flashcard view dengan flashcard yang memiliki kanji
2. Set filter ke "All"
3. Verifikasi bagian depan flashcard menampilkan:
   - Kanji di atas (besar, hitam/putih)
   - Hiragana di bawah (sedang, biru)
4. Ubah filter ke "Kanji Only"
5. Verifikasi bagian depan flashcard hanya menampilkan kanji (tanpa hiragana)
6. Ubah filter ke "Hirakana Only"
7. Verifikasi flashcard kanji tidak muncul (hanya flashcard hiragana yang muncul)

---

## Summary

Ketiga bug telah berhasil diperbaiki:

1. ✅ **Memory status auto-sync** - Flashcard dengan hiragana yang sama akan otomatis memiliki memory status yang sama
2. ✅ **Filter name** - "Hiragana Only" diubah menjadi "Hirakana Only"
3. ✅ **Filter "All" display** - Menampilkan kanji dan hiragana di bagian depan flashcard ketika filter adalah "All"

## Files Modified

1. `js/flashcard-manager.js` - Added `syncMemoryStatus()` function
2. `js/filter-engine.js` - Changed filter display name
3. `js/display-controller.js` - Modified `renderFront()` and `createFlashcardElement()`
4. `js/main.js` - Updated `renderCurrentFlashcard()` to pass filter

## Notes

- Semua perubahan backward compatible
- Tidak ada breaking changes
- Memory status sync terjadi otomatis saat aplikasi dimuat
- Filter display hanya mempengaruhi tampilan, tidak mengubah data
- Styling responsive untuk mobile, tablet, dan desktop
