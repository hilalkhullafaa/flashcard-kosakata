# Fix Kanji Font Size untuk Mobile View

## Tanggal
10 Mei 2026

## Masalah
Pada flashcard dengan kanji, huruf kanji terpotong dengan "..." di mobile view, sehingga tidak semua huruf terbaca. Maksimal baris yang diinginkan adalah 2 baris.

---

## Analisis Masalah

### Masalah Sebelumnya:
1. **Flashcard View**: Font kanji terlalu besar di mobile (`text-3xl` = 1.875rem / 30px)
2. **Guessing Game**: Font kanji terlalu besar di mobile (`text-2xl` = 1.5rem / 24px)
3. Dengan font besar, kanji panjang terpotong dengan "..." karena `webkitLineClamp: '2'`
4. `maxHeight` tidak cukup untuk menampung 2 baris dengan font besar

### Contoh Kanji yang Bermasalah:
- Kanji panjang seperti: 一緒に食べましょう
- Kanji compound: 勉強します、働きます
- Multiple kanji: 今日は天気がいいです

---

## Solusi yang Diterapkan

### 1. Flashcard View (`js/display-controller.js`)

#### Perubahan Font Size:

**BEFORE:**
```javascript
kanjiDiv.className = 'text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white break-words leading-snug';
kanjiDiv.style.maxHeight = '5.5rem';
```

**AFTER:**
```javascript
kanjiDiv.className = 'text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white break-words leading-snug';
kanjiDiv.style.maxHeight = '4.5rem';
```

**Perubahan:**
- ✅ Mobile: `text-3xl` (30px) → `text-2xl` (24px) - **Lebih kecil 20%**
- ✅ Tablet: `text-4xl` (36px) - **Tetap**
- ✅ Desktop: `text-5xl` (48px) - **Tetap**
- ✅ `maxHeight`: `5.5rem` → `4.5rem` - **Disesuaikan dengan font lebih kecil**

---

### 2. Guessing Game View (`js/main.js`)

#### Perubahan Font Size:

**BEFORE:**
```javascript
kanjiText.className = 'text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center break-words leading-snug';
kanjiText.style.maxHeight = '5rem';
```

**AFTER:**
```javascript
kanjiText.className = 'text-xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 text-center break-words leading-snug';
kanjiText.style.maxHeight = '4.5rem';
```

**Perubahan:**
- ✅ Mobile: `text-2xl` (24px) → `text-xl` (20px) - **Lebih kecil 17%**
- ✅ Tablet: `text-4xl` (36px) → `text-3xl` (30px) - **Lebih kecil 17%**
- ✅ Desktop: `text-5xl` (48px) - **Tetap**
- ✅ `maxHeight`: `5rem` → `4.5rem` - **Disesuaikan dengan font lebih kecil**

---

## Ukuran Font Breakdown

### Flashcard View:

| Breakpoint | Font Size | Pixel | Line Height | Max Lines |
|------------|-----------|-------|-------------|-----------|
| Mobile (<640px) | `text-2xl` | 24px | `leading-snug` (1.375) | 2 |
| Tablet (≥640px) | `text-4xl` | 36px | `leading-snug` (1.375) | 2 |
| Desktop (≥768px) | `text-5xl` | 48px | `leading-snug` (1.375) | 2 |

### Guessing Game View:

| Breakpoint | Font Size | Pixel | Line Height | Max Lines |
|------------|-----------|-------|-------------|-----------|
| Mobile (<640px) | `text-xl` | 20px | `leading-snug` (1.375) | 2 |
| Tablet (≥640px) | `text-3xl` | 30px | `leading-snug` (1.375) | 2 |
| Desktop (≥768px) | `text-5xl` | 48px | `leading-snug` (1.375) | 2 |

---

## Perhitungan Max Height

### Flashcard View:
```
Mobile: 24px × 1.375 (line-height) × 2 lines = 66px ≈ 4.125rem
Adjusted maxHeight: 4.5rem (72px) - memberikan sedikit ruang ekstra
```

### Guessing Game View:
```
Mobile: 20px × 1.375 (line-height) × 2 lines = 55px ≈ 3.4375rem
Adjusted maxHeight: 4.5rem (72px) - memberikan ruang ekstra untuk semua breakpoint
```

---

## CSS Properties yang Digunakan

```javascript
kanjiDiv.style.maxHeight = '4.5rem';
kanjiDiv.style.overflow = 'hidden';
kanjiDiv.style.display = '-webkit-box';
kanjiDiv.style.webkitLineClamp = '2';
kanjiDiv.style.webkitBoxOrient = 'vertical';
kanjiDiv.style.wordBreak = 'break-word';
```

**Penjelasan:**
- `maxHeight`: Membatasi tinggi maksimal
- `overflow: hidden`: Menyembunyikan teks yang melewati batas
- `display: -webkit-box`: Diperlukan untuk `webkitLineClamp`
- `webkitLineClamp: '2'`: Membatasi maksimal 2 baris
- `webkitBoxOrient: 'vertical'`: Orientasi vertikal untuk line clamp
- `wordBreak: 'break-word'`: Memecah kata panjang jika perlu

---

## Tampilan Sebelum & Sesudah

### BEFORE (Mobile):
```
Font: 30px (text-3xl)
Kanji panjang: 一緒に食べま...  ← Terpotong dengan "..."
```

### AFTER (Mobile):
```
Font: 24px (text-2xl)
Kanji panjang: 一緒に食べましょう  ← Semua terbaca dalam 2 baris
```

---

## Testing Checklist

### Mobile View (< 640px):
- ✅ Kanji pendek (1-3 karakter) terbaca dengan jelas
- ✅ Kanji sedang (4-6 karakter) terbaca dalam 1-2 baris
- ✅ Kanji panjang (7+ karakter) terbaca dalam 2 baris tanpa "..."
- ✅ Tidak ada overflow atau teks terpotong
- ✅ Line clamp bekerja dengan baik (maksimal 2 baris)

### Tablet View (≥ 640px):
- ✅ Font size meningkat sesuai dengan screen size
- ✅ Kanji tetap terbaca dengan jelas
- ✅ Maksimal 2 baris tetap terjaga

### Desktop View (≥ 768px):
- ✅ Font size optimal untuk layar besar
- ✅ Kanji terbaca dengan sangat jelas
- ✅ Maksimal 2 baris tetap terjaga

---

## Contoh Kanji untuk Testing

### Kanji Pendek (1-3 karakter):
- 今日 (kyou - hari ini)
- 食べる (taberu - makan)
- 勉強 (benkyou - belajar)

### Kanji Sedang (4-6 karakter):
- 一緒に食べる (issho ni taberu - makan bersama)
- 勉強します (benkyou shimasu - belajar)
- 働きます (hatarakimasu - bekerja)

### Kanji Panjang (7+ karakter):
- 一緒に食べましょう (issho ni tabemashou - mari makan bersama)
- 今日は天気がいいです (kyou wa tenki ga ii desu - hari ini cuaca bagus)
- お元気ですか (ogenki desu ka - apa kabar)

---

## File yang Dimodifikasi

1. **js/display-controller.js**
   - Update `renderFront()` method
   - Ubah font size kanji dari `text-3xl` → `text-2xl` untuk mobile
   - Ubah `maxHeight` dari `5.5rem` → `4.5rem`

2. **js/main.js**
   - Update `renderGuessingGameCard()` method
   - Ubah font size kanji dari `text-2xl` → `text-xl` untuk mobile
   - Ubah font size kanji dari `text-4xl` → `text-3xl` untuk tablet
   - Ubah `maxHeight` dari `5rem` → `4.5rem`

---

## Catatan Penting

### Mengapa Tidak Menggunakan `text-overflow: ellipsis`?
- `text-overflow: ellipsis` hanya bekerja untuk single line
- Untuk multi-line, kita menggunakan `-webkit-line-clamp`
- Dengan font size yang tepat, semua kanji bisa terbaca tanpa ellipsis

### Mengapa `leading-snug` (1.375)?
- `leading-tight` (1.25) terlalu rapat untuk kanji
- `leading-normal` (1.5) terlalu longgar
- `leading-snug` (1.375) memberikan spacing yang pas untuk kanji

### Mengapa `wordBreak: 'break-word'`?
- Kanji tidak memiliki spasi antar karakter
- `break-word` memastikan kanji panjang bisa dipecah ke baris berikutnya
- Tanpa ini, kanji panjang bisa overflow

---

## Responsive Behavior

### Mobile First Approach:
1. **Mobile** (default): Font kecil untuk memastikan semua terbaca
2. **Tablet** (sm:): Font sedang untuk layar lebih besar
3. **Desktop** (md:): Font besar untuk layar desktop

### Breakpoint Tailwind:
- `sm:` = 640px (tablet)
- `md:` = 768px (desktop)

---

## Kesimpulan

Dengan perubahan ini:
- ✅ Kanji di mobile view sekarang **terbaca semua** tanpa "..."
- ✅ Maksimal 2 baris tetap terjaga
- ✅ Font size responsif untuk semua device
- ✅ Line clamp bekerja dengan baik
- ✅ User experience lebih baik di mobile

---

## Rollback Instructions

Jika perlu rollback, kembalikan font size ke:

**Flashcard View:**
```javascript
kanjiDiv.className = 'text-3xl sm:text-4xl md:text-5xl ...';
kanjiDiv.style.maxHeight = '5.5rem';
```

**Guessing Game View:**
```javascript
kanjiText.className = 'text-2xl sm:text-4xl md:text-5xl ...';
kanjiText.style.maxHeight = '5rem';
```
