# Feature: Duplicate Flashcard Detection with Force Save Option

## Date: Current Session

## Overview

Fitur ini mendeteksi duplikasi flashcard berdasarkan **kombinasi Kanji DAN Hiragana/Katakana** sebelum user menyimpan flashcard baru. Jika ditemukan duplikasi, sistem akan menampilkan notifikasi pop-up yang elegan dengan informasi lengkap tentang di mana flashcard tersebut sudah ada (sumber dan bab), serta memberikan opsi untuk tetap menyimpan flashcard tersebut.

## Features

### 1. Automatic Duplicate Detection ✅

**Deskripsi**:
Sebelum flashcard disimpan, sistem secara otomatis mengecek apakah sudah ada flashcard dengan **kombinasi Kanji dan Hiragana/Katakana yang sama**.

**Kriteria Duplikasi**:
- Flashcard dianggap duplikat jika:
  - **Kanji** sama (atau keduanya kosong)
  - **DAN Hiragana/Katakana** sama

**Contoh**:
- ✅ Duplikat: 
  - Flashcard 1: Kanji="食べる", Hiragana="たべる"
  - Flashcard 2: Kanji="食べる", Hiragana="たべる"
  
- ❌ Bukan Duplikat:
  - Flashcard 1: Kanji="食べる", Hiragana="たべる"
  - Flashcard 2: Kanji="飲む", Hiragana="のむ"
  
- ❌ Bukan Duplikat:
  - Flashcard 1: Kanji="", Hiragana="たべる"
  - Flashcard 2: Kanji="食べる", Hiragana="たべる"

**Cara Kerja**:
1. User mengisi form flashcard baru
2. User klik tombol "Add" atau "Update"
3. Sistem mengecek apakah ada flashcard dengan kanji dan hiragana/katakana yang sama
4. Jika ada duplikasi → Tampilkan notifikasi dengan 2 opsi
5. Jika tidak ada duplikasi → Simpan flashcard seperti biasa (tanpa notifikasi)

### 2. Elegant Duplicate Notification with Action Buttons ✅

**Deskripsi**:
Notifikasi duplikasi ditampilkan dengan desain yang elegan dan informatif, bukan menggunakan `alert()` biasa. User diberikan 2 pilihan:
- **Batal**: Tutup notifikasi dan kembali ke form (untuk mengedit data)
- **Simpan Tetap**: Tetap menyimpan flashcard meskipun duplikat

**Design Features**:
- **Header**: Gradient orange-yellow dengan icon ⚠️
- **Title**: "Flashcard Sudah Ada"
- **Subtitle**: "Kosakata ini sudah terdaftar"
- **Body**: Menampilkan kanji dan hiragana/katakana yang duplikat dengan highlight biru
- **Duplicate List**: Card untuk setiap sumber yang berisi:
  - Nama sumber (📚)
  - Daftar bab (📖)
- **Action Buttons**: 
  - Tombol "Batal" (gray) - Tutup notifikasi
  - Tombol "Simpan Tetap" (blue) - Force save flashcard
- **Animations**: Fade in dan slide up untuk smooth appearance

**Color Scheme**:
- Light Mode:
  - Header: Gradient yellow-500 to orange-500
  - Body: White background
  - Duplicate cards: Blue-50 background with blue-500 border
  - Batal button: Gray-500
  - Simpan Tetap button: Blue-500
- Dark Mode:
  - Header: Gradient yellow-600 to orange-600
  - Body: Slate-800 background
  - Duplicate cards: Slate-700 background with blue-400 border
  - Batal button: Gray-500
  - Simpan Tetap button: Indigo-600

## Implementation Details

### 1. FlashcardManager - checkDuplicates()

**File**: `js/flashcard-manager.js`

**Function**:
```javascript
checkDuplicates(kanji, hiragana, excludeId = null) {
    // Normalize kanji (treat empty string and null as the same)
    const normalizedKanji = (kanji || '').trim();
    
    const duplicates = this.flashcards.filter(fc => {
        const fcKanji = (fc.kanji || '').trim();
        // Match if both kanji AND hiragana are the same
        return fcKanji === normalizedKanji && 
               fc.hiragana === hiragana && 
               fc.id !== excludeId;
    });
    
    // Group by source and collect chapters
    // ... (grouping logic)
}
```

**Parameters**:
- `kanji` (string): Kanji yang akan dicek (bisa kosong)
- `hiragana` (string): Hiragana/Katakana yang akan dicek
- `excludeId` (string, optional): ID flashcard yang dikecualikan (untuk mode edit)

**Returns**:
Array of objects dengan struktur:
```javascript
[
    {
        source: "IRODORI Beginner Level (A1)",
        chapters: [1, 3, 5]
    },
    {
        source: "IRODORI Basic Level 1 (A2)",
        chapters: [2, 4]
    }
]
```

### 2. FlashcardManager - createFlashcard() (Modified)

**Changes**:
```javascript
createFlashcard(data, forceSave = false) {
    // Validate data
    const errors = validateFlashcardData(data);
    if (errors.length > 0) {
        return {
            success: false,
            errors: errors
        };
    }

    // Check for duplicates (skip if forceSave is true) (NEW)
    if (!forceSave) {
        const duplicates = this.checkDuplicates(data.kanji, data.hiragana);
        if (duplicates.length > 0) {
            return {
                success: false,
                isDuplicate: true,
                duplicates: duplicates,
                flashcardData: {
                    kanji: data.kanji,
                    hiragana: data.hiragana
                },
                message: 'Flashcard dengan kanji dan hiragana/katakana ini sudah ada'
            };
        }
    }

    // ... rest of the code (create flashcard)
}
```

**New Parameter**:
- `forceSave` (boolean, default: false): Jika true, skip pengecekan duplikasi dan langsung simpan

**Return Object (when duplicate found)**:
```javascript
{
    success: false,
    isDuplicate: true,
    duplicates: [
        {
            source: "IRODORI Beginner Level (A1)",
            chapters: [1, 3]
        }
    ],
    flashcardData: {
        kanji: "食べる",
        hiragana: "たべる"
    },
    message: 'Flashcard dengan kanji dan hiragana/katakana ini sudah ada'
}
```

### 3. Main App - handleFormSubmit() (Modified)

**File**: `js/main.js`

**Changes**:
```javascript
handleFormSubmit(form, existingFlashcard = null, returnSource = null, returnChapter = null, forceSave = false) {
    // ... get form data ...

    let result;
    if (existingFlashcard) {
        result = flashcardManager.updateFlashcard(existingFlashcard.id, data);
    } else {
        result = flashcardManager.createFlashcard(data, forceSave); // Pass forceSave
    }

    if (result.success) {
        // Close modal and redirect
        this.closeModal();
        // ... redirect logic ...
    } else if (result.isDuplicate) {
        // Show duplicate notification with callback (NEW)
        this.showDuplicateNotification(result.duplicates, data, () => {
            // Callback to force save
            this.handleFormSubmit(form, existingFlashcard, returnSource, returnChapter, true);
        });
    } else {
        // Show validation errors
        this.showFormErrors(result.errors);
    }
}
```

**New Parameter**:
- `forceSave` (boolean, default: false): Flag untuk force save meskipun duplikat

### 4. Main App - showDuplicateNotification() (Modified)

**File**: `js/main.js`

**Function**: Creates and displays elegant duplicate notification with action buttons

**New Parameter**:
- `onForceSave` (Function, optional): Callback yang dipanggil ketika user klik "Simpan Tetap"

**Structure**:
```
Overlay (z-index: 60, semi-transparent black)
└── Card (white/slate-800, rounded-2xl, shadow-2xl)
    ├── Header (gradient orange-yellow)
    │   ├── Icon (⚠️)
    │   └── Text
    │       ├── Title: "Flashcard Sudah Ada"
    │       └── Subtitle: "Kosakata ini sudah terdaftar"
    ├── Body
    │   ├── Info Text: "Flashcard dengan kanji [X] dan hiragana/katakana [Y] sudah ada di:"
    │   ├── Duplicate List
    │   │   └── For each source:
    │   │       ├── Source Name (📚)
    │   │       └── Chapters (📖 Bab: 1, 3, 5)
    │   └── Actions
    │       ├── Batal Button (gray)
    │       └── Simpan Tetap Button (blue)
```

**Button Actions**:
- **Batal**: Close notification, return to form
- **Simpan Tetap**: Close notification, call `onForceSave()` callback to save with `forceSave=true`

**Animations**:
- Overlay: Fade in (0.2s)
- Card: Slide up (0.3s)
- Close: Fade out (0.2s)

**Interactions**:
- Click "Tutup" button → Close notification
- Click overlay (outside card) → Close notification
- Notification stays open until user closes it

## User Flow

### Scenario 1: No Duplicate (Normal Flow)

```
1. User fills flashcard form
   - Kanji: 食べる
   - Hiragana: たべる
   - Meaning: To eat
   - Source: IRODORI Beginner Level (A1)
   - Chapters: 5

2. User clicks "Add"

3. System checks for duplicates
   → No duplicate found (no flashcard with kanji="食べる" AND hiragana="たべる")

4. Flashcard saved successfully
   → No notification shown
   → Modal closes
   → Return to main view
```

### Scenario 2: Duplicate Found - User Cancels

```
1. User fills flashcard form
   - Kanji: こんにちは
   - Hiragana: こんにちは
   - Meaning: Hello
   - Source: IRODORI Basic Level 1 (A2)
   - Chapters: 5

2. User clicks "Add"

3. System checks for duplicates
   → Duplicate found!
   → Kanji="" AND Hiragana="こんにちは" already exists in:
      - IRODORI Beginner Level (A1), Bab: 1, 3
      - IRODORI Basic Level 1 (A1), Bab: 2

4. Show duplicate notification
   ┌─────────────────────────────────────┐
   │ ⚠️  Flashcard Sudah Ada             │
   │     Kosakata ini sudah terdaftar    │
   ├─────────────────────────────────────┤
   │ Flashcard dengan hiragana/katakana  │
   │ こんにちは sudah ada di:            │
   │                                     │
   │ ┌─────────────────────────────────┐ │
   │ │ 📚 IRODORI Beginner Level (A1)  │ │
   │ │ 📖 Bab: 1, 3                    │ │
   │ └─────────────────────────────────┘ │
   │                                     │
   │ ┌─────────────────────────────────┐ │
   │ │ 📚 IRODORI Basic Level 1 (A1)   │ │
   │ │ 📖 Bab: 2                       │ │
   │ └─────────────────────────────────┘ │
   │                                     │
   │    [ Batal ]  [ Simpan Tetap ]     │
   └─────────────────────────────────────┘

5. User clicks "Batal"
   → Notification closes
   → Form stays open
   → User can modify the form or cancel
```

### Scenario 3: Duplicate Found - User Force Saves

```
1. User fills flashcard form
   - Kanji: 食べる
   - Hiragana: たべる
   - Meaning: To eat
   - Source: IRODORI Basic Level 1 (A2)
   - Chapters: 5

2. User clicks "Add"

3. System checks for duplicates
   → Duplicate found!
   → Kanji="食べる" AND Hiragana="たべる" already exists in:
      - IRODORI Beginner Level (A1), Bab: 1

4. Show duplicate notification
   ┌─────────────────────────────────────┐
   │ ⚠️  Flashcard Sudah Ada             │
   │     Kosakata ini sudah terdaftar    │
   ├─────────────────────────────────────┤
   │ Flashcard dengan kanji 食べる dan   │
   │ hiragana/katakana たべる sudah ada  │
   │ di:                                 │
   │                                     │
   │ ┌─────────────────────────────────┐ │
   │ │ 📚 IRODORI Beginner Level (A1)  │ │
   │ │ 📖 Bab: 1                       │ │
   │ └─────────────────────────────────┘ │
   │                                     │
   │    [ Batal ]  [ Simpan Tetap ]     │
   └─────────────────────────────────────┘

5. User clicks "Simpan Tetap"
   → Notification closes
   → System calls createFlashcard(data, forceSave=true)
   → Flashcard saved successfully (duplicate allowed)
   → Modal closes
   → Return to main view
   
6. Result: Now there are 2 flashcards with same kanji and hiragana
   - Flashcard 1: 食べる/たべる in Bab 1
   - Flashcard 2: 食べる/たべる in Bab 5 (newly created)
```

## Benefits

1. **Prevents Accidental Duplication**: Alerts user when creating duplicate flashcards
2. **Flexible**: User can choose to save duplicate if intentional (e.g., same word in different contexts)
3. **User-Friendly**: Clear information about where duplicates exist
4. **Elegant Design**: Modern, professional notification instead of browser alert
5. **Informative**: Shows all sources and chapters where duplicate exists
6. **Non-Blocking**: User can review information and decide what to do
7. **Consistent UX**: Matches the app's design language (Tailwind CSS, dark mode support)
8. **Smart Detection**: Checks both Kanji AND Hiragana/Katakana combination

## Technical Notes

### Duplicate Detection Logic

```javascript
// Flashcard is considered duplicate if:
// 1. Kanji matches (or both are empty)
// 2. AND Hiragana/Katakana matches

const normalizedKanji = (kanji || '').trim();
const fcKanji = (fc.kanji || '').trim();

isDuplicate = (fcKanji === normalizedKanji) && (fc.hiragana === hiragana);
```

### Force Save Mechanism

When user clicks "Simpan Tetap":
1. Notification closes
2. `onForceSave()` callback is called
3. Callback calls `handleFormSubmit()` with `forceSave=true`
4. `createFlashcard()` is called with `forceSave=true`
5. Duplicate check is skipped
6. Flashcard is saved successfully

### Z-Index Hierarchy
- Modal form: z-50
- Duplicate notification overlay: z-60 (appears above form)

### Animations
All animations are defined inline in the `showDuplicateNotification()` function:
- `fadeIn`: 0.2s ease-out
- `fadeOut`: 0.2s ease-out
- `slideUp`: 0.3s ease-out

### Responsive Design
- Mobile: Full width with padding
- Tablet/Desktop: Max width 28rem (448px)
- All text and spacing are responsive

### Dark Mode Support
- Automatically adapts to user's theme preference
- Uses Tailwind's `dark:` variants
- Maintains readability in both modes

## Testing Checklist

- [ ] Create new flashcard with unique kanji+hiragana → Should save without notification
- [ ] Create new flashcard with duplicate kanji+hiragana → Should show notification
- [ ] Create flashcard with same hiragana but different kanji → Should save without notification (not duplicate)
- [ ] Create flashcard with same kanji but different hiragana → Should save without notification (not duplicate)
- [ ] Create flashcard with empty kanji, same hiragana as existing empty kanji flashcard → Should show notification
- [ ] Notification shows correct source names
- [ ] Notification shows correct chapter numbers (sorted)
- [ ] Notification shows all sources where duplicate exists
- [ ] Notification displays kanji and hiragana correctly in info text
- [ ] Click "Batal" button → Notification closes, form stays open
- [ ] Click "Simpan Tetap" button → Notification closes, flashcard saved, modal closes
- [ ] After force save, duplicate flashcard exists in database
- [ ] Click overlay (outside card) → Notification closes
- [ ] Notification appears above form modal (z-index correct)
- [ ] Animations work smoothly (fade in, slide up, fade out)
- [ ] Dark mode styling works correctly
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Multiple duplicates across different sources display correctly
- [ ] Button styling and hover effects work correctly

## Future Enhancements (Optional)

1. **Merge Chapters**: Instead of creating duplicate, add new chapters to existing flashcard
2. **Show Flashcard Preview**: Display the existing flashcard details in notification
3. **Quick Edit**: Add button to edit existing flashcard directly from notification
4. **Batch Import**: Handle duplicates when importing multiple flashcards
5. **Sound Effect**: Add subtle sound when notification appears
6. **Keyboard Shortcut**: ESC key to close notification, Enter to force save

## Files Modified

1. `js/flashcard-manager.js`:
   - Added `checkDuplicates()` method
   - Modified `createFlashcard()` to check for duplicates

2. `js/main.js`:
   - Modified `handleFormSubmit()` to handle duplicate case
   - Added `showDuplicateNotification()` method

## Conclusion

Fitur deteksi duplikasi ini meningkatkan user experience dengan:
- Mencegah duplikasi data secara otomatis
- Memberikan feedback yang jelas dan informatif
- Menggunakan desain yang elegan dan modern
- Mendukung dark mode dan responsive design

User sekarang dapat dengan mudah mengetahui jika flashcard yang akan dibuat sudah ada, dan di mana lokasinya (sumber dan bab).
