# Perbaikan Ukuran Font Kanji untuk Mobile View

## Tanggal
10 Mei 2026

## Masalah
Huruf kanji pada flashcard terpotong dengan "..." di mobile view, sehingga tidak semua huruf terbaca. User meminta agar semua kanji terbaca dengan maksimal 2 baris.

---

## Solusi

### 1. Flashcard View
**Perubahan:**
- Mobile: Font size dikurangi dari `text-3xl` (30px) → `text-2xl` (24px)
- Tablet: Tetap `text-4xl` (36px)
- Desktop: Tetap `text-5xl` (48px)
- Max height disesuaikan: `5.5rem` → `4.5rem`

### 2. Guessing Game View
**Perubahan:**
- Mobile: Font size dikurangi dari `text-2xl` (24px) → `text-xl` (20px)
- Tablet: Font size dikurangi dari `text-4xl` (36px) → `text-3xl` (30px)
- Desktop: Tetap `text-5xl` (48px)
- Max height disesuaikan: `5rem` → `4.5rem`

---

## Hasil

### Sebelum:
```
Mobile: 一緒に食べま...  ← Terpotong
```

### Sesudah:
```
Mobile: 一緒に食べましょう  ← Semua terbaca dalam 2 baris
```

---

## Ukuran Font per Device

### Flashcard View:
| Device | Font Size | Ukuran |
|--------|-----------|--------|
| Mobile | text-2xl | 24px |
| Tablet | text-4xl | 36px |
| Desktop | text-5xl | 48px |

### Guessing Game View:
| Device | Font Size | Ukuran |
|--------|-----------|--------|
| Mobile | text-xl | 20px |
| Tablet | text-3xl | 30px |
| Desktop | text-5xl | 48px |

---

## Testing

Silakan test dengan kanji berikut:

**Kanji Pendek:**
- 今日 (hari ini)
- 食べる (makan)

**Kanji Sedang:**
- 一緒に食べる (makan bersama)
- 勉強します (belajar)

**Kanji Panjang:**
- 一緒に食べましょう (mari makan bersama)
- 今日は天気がいいです (hari ini cuaca bagus)

---

## File yang Diubah

1. `js/display-controller.js` - Flashcard view
2. `js/main.js` - Guessing game view

---

## Catatan

- ✅ Semua kanji sekarang terbaca di mobile
- ✅ Maksimal 2 baris tetap terjaga
- ✅ Responsive untuk semua device
- ✅ Tidak ada "..." lagi

---

## Cara Test

1. Buka aplikasi di **mobile** (atau resize browser ke mobile size)
2. Tambahkan flashcard dengan kanji panjang
3. Lihat flashcard - semua kanji harus terbaca
4. Test juga di guessing game
5. Verifikasi maksimal 2 baris
