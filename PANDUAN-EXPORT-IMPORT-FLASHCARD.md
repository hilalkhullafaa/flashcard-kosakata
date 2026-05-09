# Panduan Export & Import Flashcard

## Tanggal
10 Mei 2026

## Fitur Baru: Backup & Restore Data Flashcard

Sekarang Anda bisa **save** (export) dan **load** (import) dataset flashcard dari/ke file JSON!

---

## Cara Menggunakan

### 📤 Export (Save) Flashcard

1. Klik tombol **"💾 Data"** di header (desktop)
2. Pilih **"📤 Export Data"**
3. File JSON akan otomatis ter-download
4. Nama file: `flashcards-backup-YYYY-MM-DD.json`

**Contoh:**
```
flashcards-backup-2026-05-10.json
```

### 📥 Import (Load) Flashcard

1. Klik tombol **"💾 Data"** di header (desktop)
2. Pilih **"📥 Import Data"**
3. Pilih file JSON yang ingin di-import
4. Pilih mode import:
   - **🔄 Replace (Ganti Semua)**: Hapus data lama, ganti dengan data baru
   - **➕ Merge (Gabungkan)**: Tambahkan data baru ke data lama (skip duplikat)
5. Klik mode yang diinginkan
6. Data akan ter-import dan tampilan akan refresh

---

## Mode Import

### 🔄 Replace Mode (Ganti Semua)
- **Fungsi**: Hapus semua flashcard lama, ganti dengan data baru
- **Kapan digunakan**: 
  - Ingin mulai dari awal dengan dataset baru
  - Restore dari backup
  - Ganti dataset dengan yang lebih baru
- **⚠️ Peringatan**: Data lama akan hilang! Backup dulu sebelum replace

### ➕ Merge Mode (Gabungkan)
- **Fungsi**: Tambahkan flashcard baru ke data yang sudah ada
- **Kapan digunakan**:
  - Menambah flashcard dari sumber lain
  - Gabungkan dataset dari teman
  - Import tambahan tanpa kehilangan data lama
- **Duplikat**: Flashcard dengan ID yang sama akan di-skip

---

## Format File JSON

File export akan berisi:
```json
{
  "version": "1.0",
  "exportDate": "2026-05-10T12:34:56.789Z",
  "totalFlashcards": 10,
  "flashcards": [
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
}
```

---

## Kegunaan

### 💾 Backup Data
- Simpan data flashcard secara permanen
- Tidak khawatir kehilangan data jika clear browser
- Backup berkala untuk keamanan data

### 🔄 Transfer Data
- Pindahkan data dari laptop ke HP
- Pindahkan data dari browser lama ke browser baru
- Gunakan dataset yang sama di berbagai device

### 📤 Share Dataset
- Bagikan dataset dengan teman
- Share di komunitas belajar bahasa Jepang
- Kolaborasi dalam membuat dataset

### 🛡️ Data Safety
- Restore data jika terjadi masalah
- Rollback ke versi sebelumnya
- Simpan multiple versi dataset

---

## Tips & Trik

### 📅 Backup Berkala
- Export data setiap minggu/bulan
- Simpan file dengan nama yang jelas
- Contoh: `flashcards-irodori-bab1-5.json`

### 📁 Organisasi File
- Buat folder khusus untuk backup
- Gunakan nama file yang deskriptif
- Tambahkan tanggal di nama file

### 🔄 Sebelum Update Besar
- Selalu export data sebelum import data baru
- Backup sebelum clear browser
- Simpan versi lama sebagai cadangan

### 📤 Share dengan Teman
1. Export dataset Anda
2. Share file JSON via email/chat
3. Teman import dengan mode Merge
4. Teman bisa gabungkan dengan dataset mereka

---

## Error Messages

### Export Errors:
- ❌ **"No flashcards to export"**: Belum ada flashcard, tambahkan dulu
- ❌ **"Failed to export"**: Coba lagi atau refresh browser

### Import Errors:
- ❌ **"Invalid file type"**: File harus .json
- ❌ **"Invalid JSON file"**: File rusak atau format salah
- ❌ **"No flashcards found"**: File kosong atau format salah
- ❌ **"Invalid flashcard structure"**: Data tidak lengkap

---

## FAQ

### Q: Apakah data progress (memory status) ikut ter-export?
**A:** Ya! Semua data termasuk memory status, created date, updated date ikut ter-export.

### Q: Apakah bisa import file dari aplikasi lain?
**A:** Bisa, asalkan format JSON sesuai dengan struktur yang dibutuhkan.

### Q: Berapa ukuran file export?
**A:** Sekitar 1KB per flashcard. 100 flashcard ≈ 100KB, 1000 flashcard ≈ 1MB.

### Q: Apakah bisa export hanya sebagian flashcard?
**A:** Saat ini belum bisa. Export akan mengambil semua flashcard.

### Q: Bagaimana cara backup otomatis?
**A:** Saat ini harus manual. Untuk otomatis, bisa gunakan browser extension atau script.

### Q: Apakah aman untuk share file JSON?
**A:** Ya, file hanya berisi data flashcard (kanji, hiragana, meaning, dll). Tidak ada data pribadi.

---

## Troubleshooting

### Export tidak berfungsi:
1. Pastikan ada flashcard di aplikasi
2. Coba refresh browser
3. Cek browser console untuk error
4. Coba browser lain

### Import tidak berfungsi:
1. Pastikan file format .json
2. Cek isi file dengan text editor
3. Pastikan struktur JSON benar
4. Coba file export yang baru
5. Coba mode import yang berbeda

### File tidak ter-download:
1. Cek browser download settings
2. Cek popup blocker
3. Cek disk space
4. Coba browser lain

---

## Contoh Use Case

### Use Case 1: Backup Mingguan
```
1. Setiap Minggu, export data
2. Simpan dengan nama: flashcards-backup-2026-05-10.json
3. Simpan di folder: Documents/Flashcard-Backups/
4. Hapus backup lama (> 1 bulan)
```

### Use Case 2: Transfer ke HP
```
1. Di laptop: Export data
2. Send file via email/WhatsApp ke diri sendiri
3. Di HP: Buka aplikasi di browser
4. Import file dengan mode Replace
5. Selesai! Data sudah sama
```

### Use Case 3: Share dengan Teman
```
1. Export dataset Anda
2. Share file ke teman via email
3. Teman import dengan mode Merge
4. Teman sekarang punya dataset Anda + dataset mereka
```

### Use Case 4: Restore Setelah Clear Browser
```
1. Browser di-clear (data hilang)
2. Buka aplikasi (kosong)
3. Import file backup terakhir dengan mode Replace
4. Data kembali seperti semula!
```

---

## Kesimpulan

Fitur Export/Import memudahkan Anda untuk:
- ✅ Backup data flashcard
- ✅ Transfer data antar device
- ✅ Share dataset dengan teman
- ✅ Restore data jika terjadi masalah
- ✅ Simpan data secara permanen

**Jangan lupa backup data Anda secara berkala!** 💾

---

## File yang Ditambahkan/Dimodifikasi

1. `js/storage-manager.js` - Fungsi export/import
2. `js/flashcard-manager.js` - Wrapper functions
3. `js/main.js` - UI handlers dan event listeners
4. `index.html` - Data menu button dan dropdown

---

## Support

Jika ada masalah atau pertanyaan:
1. Cek dokumentasi lengkap: `FEATURE-EXPORT-IMPORT-FLASHCARDS.md`
2. Cek browser console untuk error messages
3. Coba refresh browser atau clear cache
4. Coba browser lain
