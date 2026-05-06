# Japanese Vocabulary Flashcard App

Aplikasi flashcard untuk belajar kosakata bahasa Jepang dari buku IRODORI.

## Fitur Utama

- ✅ Tambah, Edit, dan Hapus flashcard kosakata
- ✅ Organisasi berdasarkan sumber buku dan bab
- ✅ Progress tracker untuk Hiragana/Katakana dan Kanji
- ✅ Mode permainan tebak kosakata
- ✅ Pencarian kosakata
- ✅ Filter dan shuffle flashcard
- ✅ Dark mode / Light mode
- ✅ Penyimpanan lokal (localStorage)

## Sumber Buku yang Didukung

1. **IRODORI Beginner Level (A1)**
2. **IRODORI Basic Level 1 (A1)**
3. **IRODORI Basic Level 1 (A2)**

## Cara Menggunakan

### 1. Menambah Flashcard

1. Klik tombol **"+"** di pojok kanan atas
2. Isi form:
   - **Kanji** (opsional): Karakter kanji
   - **Hiragana/Katakana** (wajib): Pembacaan hiragana/katakana
   - **Meaning** (wajib): Arti dalam bahasa Indonesia
   - **Romaji** (wajib): Romanisasi
   - **Source** (wajib): Pilih sumber buku
   - **Chapters** (wajib): Nomor bab (pisahkan dengan koma untuk multiple bab, contoh: 1,2,3)
3. Klik **"Add"**

### 2. Menambah Flashcard ke Multiple Bab

Untuk menambahkan flashcard yang sama ke beberapa bab dalam satu sumber:

**Contoh:**
```
Hiragana: わたし
Meaning: Saya
Romaji: watashi
Source: IRODORI Beginner Level (A1)
Chapters: 1,2,3  ← Pisahkan dengan koma
```

Flashcard akan muncul di Bab 1, 2, dan 3.

### 3. Menambah Flashcard ke Multiple Sumber

Untuk menambahkan kosakata yang sama ke beberapa sumber buku, **buat flashcard terpisah** untuk setiap sumber:

**Flashcard 1:**
```
Hiragana: わたし
Source: IRODORI Beginner Level (A1)
Chapters: 1
```

**Flashcard 2:**
```
Hiragana: わたし
Source: IRODORI Basic Level 1 (A1)
Chapters: 3
```

### 4. Mengelola Flashcard

1. Klik tombol **"⚙️ Kelola"** pada sumber atau bab
2. Klik **"✏️ Edit"** untuk mengedit flashcard
3. Klik **"🗑️ Hapus"** untuk menghapus flashcard

### 5. Melihat dan Belajar Flashcard

1. Klik tombol **"👁️ Lihat"** pada bab atau **"📚 Lihat Semua"** pada sumber
2. Klik flashcard untuk membalik (flip)
3. Klik **"✅ Sudah Ingat"** jika sudah hafal
4. Klik **"❌ Belum Ingat"** jika belum hafal

### 6. Permainan Tebak Kosakata

1. Klik tombol **"🎮 Permainan"** atau **"🎮 Main"**
2. Lihat kanji/hiragana yang ditampilkan
3. Ketik jawaban dalam bahasa Indonesia
4. Klik **"Submit"** atau tekan **Enter**
5. Atau klik **"Show Answer"** untuk melihat jawaban

### 7. Mencari Kosakata

1. Ketik kata kunci di kotak pencarian di bagian atas
2. Hasil pencarian akan muncul secara realtime
3. Hapus teks pencarian untuk kembali ke tampilan utama

### 8. Filter dan Shuffle

Saat melihat flashcard:
- Gunakan **dropdown filter** untuk memfilter berdasarkan jenis script (All, Kanji Only, Hiragana Only)
- Klik **"🔀 Acak"** untuk mengacak urutan flashcard

### 9. Dark Mode / Light Mode

Klik tombol **🌙/☀️** di pojok kanan atas untuk mengganti tema.

## Progress Tracker

### Progress Keseluruhan
Ditampilkan di halaman utama, menunjukkan:
- **Kosakata Hiragana/Katakana**: Total kosakata unik berdasarkan hiragana
- **Kosakata Kanji**: Total kosakata unik berdasarkan kanji

### Progress Per Sumber
Ditampilkan di setiap section sumber, menunjukkan progress untuk sumber tersebut.

### Cara Kerja Deduplication
- **Per-chapter view**: Flashcard yang sama muncul di setiap bab (tidak ada deduplication)
- **All-sources view**: Flashcard dideduplikasi berdasarkan Hiragana/Katakana
- **Progress tracking**: Menggunakan Hiragana/Katakana atau Kanji sebagai identifier unik

## Tips Penggunaan

1. **Gunakan koma** untuk memisahkan nomor bab (contoh: 1,2,3)
2. **Buat flashcard terpisah** untuk sumber yang berbeda
3. **Gunakan fitur pencarian** untuk menemukan kosakata dengan cepat
4. **Gunakan permainan** untuk menguji hafalan Anda
5. **Tandai "Sudah Ingat"** untuk melacak progress belajar Anda

## Penyimpanan Data

- Data disimpan di **localStorage** browser Anda
- Data **tidak akan hilang** saat menutup browser
- Data **hanya tersedia di browser yang sama**
- Untuk backup, Anda perlu export data secara manual (fitur belum tersedia)

### Menghapus Data Lama

Jika Anda masih melihat data dummy lama atau ingin memulai dari awal:

1. Buka file **`clear-storage.html`** di browser
2. Klik tombol **"🗑️ Hapus Semua Data"**
3. Konfirmasi penghapusan
4. Aplikasi akan otomatis kembali ke halaman utama dengan data kosong

**PERINGATAN:** Data yang dihapus tidak dapat dikembalikan!

## Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Opera

## Teknologi

- **HTML5**
- **Tailwind CSS** (via CDN)
- **Vanilla JavaScript** (ES6 Modules)
- **localStorage** untuk penyimpanan data

## Lisensi

© 2024 HILKA. All rights reserved.

---

**Selamat Belajar! がんばって！ (Ganbatte!)**
