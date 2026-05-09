# Fix Flashcard Front - Kanji Only Display

## Tanggal
7 Mei 2026

## Masalah
Pada tampilan depan flashcard kanji, menampilkan kanji DAN hiragana di bawahnya. Ini membuat user langsung melihat cara baca (hiragana) sebelum mencoba mengingat sendiri.

---

## Solusi yang Diterapkan

### File: js/display-controller.js

#### Perubahan pada `renderFront()`:

**BEFORE (Menampilkan Kanji + Hiragana):**
```javascript
// Kanji display (if exists)
if (flashcard.kanji && flashcard.kanji.trim() !== '') {
    const kanjiDiv = document.createElement('div');
    kanjiDiv.className = 'text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 break-words leading-tight';
    kanjiDiv.textContent = flashcard.kanji;
    frontDiv.appendChild(kanjiDiv);
}

// Hiragana/Katakana display (SELALU DITAMPILKAN)
const hiraganaDiv = document.createElement('div');
hiraganaDiv.className = flashcard.kanji 
    ? 'text-2xl sm:text-3xl md:text-4xl font-medium text-gray-700 dark:text-white break-words leading-tight' 
    : 'text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700 dark:text-white break-words leading-tight';
hiraganaDiv.textContent = flashcard.hiragana;
frontDiv.appendChild(hiraganaDiv); // ❌ Hiragana selalu muncul
```

**AFTER (Hanya Kanji ATAU Hiragana):**
```javascript
// Kanji display (if exists) - ONLY show kanji, no hiragana below
if (flashcard.kanji && flashcard.kanji.trim() !== '') {
    const kanjiDiv = document.createElement('div');
    kanjiDiv.className = 'text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white break-words leading-tight';
    kanjiDiv.textContent = flashcard.kanji;
    frontDiv.appendChild(kanjiDiv); // ✅ Hanya kanji
} else {
    // Hiragana/Katakana display (only if no kanji)
    const hiraganaDiv = document.createElement('div');
    hiraganaDiv.className = 'text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700 dark:text-white break-words leading-tight';
    hiraganaDiv.textContent = flashcard.hiragana;
    frontDiv.appendChild(hiraganaDiv); // ✅ Hanya hiragana (jika tidak ada kanji)
}
```

---

## Logika Baru

### Kondisi 1: Flashcard dengan Kanji
```
FRONT (Depan):
┌─────────────────┐
│                 │
│      今日は      │  ← Hanya Kanji
│                 │
│ 👆 Klik untuk   │
│  melihat arti   │
└─────────────────┘

BACK (Belakang):
┌─────────────────┐
│     Hello       │  ← Meaning
│   konnichiwa    │  ← Romaji
│                 │
│ 📚 IRODORI      │  ← Source
│ 📖 Bab 1        │  ← Chapter
│                 │
│ こんにちは       │  ← Hiragana (ada di info)
└─────────────────┘
```

### Kondisi 2: Flashcard tanpa Kanji (Hiragana Only)
```
FRONT (Depan):
┌─────────────────┐
│                 │
│   こんにちは     │  ← Hanya Hiragana
│                 │
│ 👆 Klik untuk   │
│  melihat arti   │
└─────────────────┘

BACK (Belakang):
┌─────────────────┐
│     Hello       │  ← Meaning
│   konnichiwa    │  ← Romaji
│                 │
│ 📚 IRODORI      │  ← Source
│ 📖 Bab 1        │  ← Chapter
└─────────────────┘
```

---

## Perubahan Detail

### 1. Hapus `mb-4 md:mb-6` dari Kanji
- **Before**: Kanji memiliki margin bottom karena ada hiragana di bawahnya
- **After**: Tidak perlu margin bottom karena tidak ada hiragana

### 2. Gunakan `if-else` Statement
- **Before**: Kanji dan Hiragana ditampilkan secara terpisah (keduanya bisa muncul)
- **After**: Hanya satu yang ditampilkan (kanji ATAU hiragana)

### 3. Ukuran Font Konsisten
- **Kanji (jika ada)**: `text-4xl sm:text-5xl md:text-6xl` (besar)
- **Hiragana (jika tidak ada kanji)**: `text-4xl sm:text-5xl md:text-6xl` (besar)
- Keduanya sama besar karena masing-masing adalah konten utama

---

## Keuntungan

1. ✅ **Lebih Challenging**: User harus mengingat cara baca kanji tanpa melihat hiragana
2. ✅ **Fokus Belajar**: Melatih kemampuan membaca kanji
3. ✅ **Cleaner UI**: Tampilan depan lebih bersih dan fokus
4. ✅ **Konsisten**: Flashcard kanji dan hiragana-only memiliki ukuran yang sama
5. ✅ **Informasi Lengkap di Belakang**: Hiragana tetap bisa dilihat di bagian belakang flashcard

---

## Tampilan Sebelum & Sesudah

### BEFORE (Kanji + Hiragana):
```
┌─────────────────┐
│                 │
│      今日は      │  ← Kanji (besar)
│                 │
│   こんにちは     │  ← Hiragana (sedang) ❌ Langsung terlihat
│                 │
│ 👆 Klik untuk   │
│  melihat arti   │
└─────────────────┘
```

### AFTER (Hanya Kanji):
```
┌─────────────────┐
│                 │
│      今日は      │  ← Hanya Kanji ✅
│                 │
│ 👆 Klik untuk   │
│  melihat arti   │
└─────────────────┘
```

---

## Testing Checklist

- ✅ Flashcard dengan kanji: Hanya menampilkan kanji di depan
- ✅ Flashcard tanpa kanji: Menampilkan hiragana di depan
- ✅ Hiragana tetap muncul di bagian belakang flashcard
- ✅ Ukuran font konsisten untuk kanji dan hiragana-only
- ✅ Responsive di mobile dan desktop
- ✅ Styling konsisten dengan tema Slate + Indigo

---

## Catatan

Perubahan ini membuat flashcard lebih efektif untuk pembelajaran karena:
- User tidak langsung melihat cara baca (hiragana) di depan
- Melatih kemampuan membaca kanji secara mandiri
- Hiragana tetap tersedia di bagian belakang untuk verifikasi

Ini adalah praktik standar dalam flashcard pembelajaran bahasa Jepang.

