# Informasi Font yang Digunakan

## Tanggal
10 Mei 2026

## Font Stack

Aplikasi ini menggunakan **Tailwind CSS Default Font Stack** yang tidak didefinisikan secara eksplisit, sehingga menggunakan font system default.

---

## Default Font Stack Tailwind CSS

### Sans-serif (Default)
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", 
             sans-serif, "Apple Color Emoji", "Segoe UI Emoji", 
             "Segoe UI Symbol", "Noto Color Emoji";
```

### Breakdown per Platform:

| Platform | Font yang Digunakan |
|----------|---------------------|
| **macOS** | San Francisco (system-ui) |
| **iOS** | San Francisco (system-ui) |
| **Windows** | Segoe UI |
| **Android** | Roboto |
| **Linux** | Noto Sans / Liberation Sans |
| **Fallback** | Arial, sans-serif |

---

## Font untuk Karakter Jepang

### Kanji, Hiragana, Katakana:

Karena aplikasi ini menampilkan karakter Jepang, browser akan otomatis memilih font yang mendukung karakter Jepang dari font stack:

| Platform | Font Jepang yang Digunakan |
|----------|----------------------------|
| **macOS** | Hiragino Sans / Hiragino Kaku Gothic Pro |
| **iOS** | Hiragino Sans |
| **Windows** | Yu Gothic / Meiryo |
| **Android** | Noto Sans CJK JP / Roboto |
| **Linux** | Noto Sans CJK JP |

---

## Font Weights yang Digunakan

Aplikasi ini menggunakan berbagai font weights dari Tailwind CSS:

| Class | Weight | Penggunaan |
|-------|--------|------------|
| `font-normal` | 400 | Text biasa |
| `font-medium` | 500 | Button, label |
| `font-semibold` | 600 | Sub-heading, emphasis |
| `font-bold` | 700 | Heading, kanji, hiragana |

---

## Font Sizes yang Digunakan

### Text Sizes (Tailwind):

| Class | Size | Penggunaan |
|-------|------|------------|
| `text-xs` | 0.75rem (12px) | Small text, badges |
| `text-sm` | 0.875rem (14px) | Secondary text |
| `text-base` | 1rem (16px) | Body text, buttons |
| `text-lg` | 1.125rem (18px) | Large text |
| `text-xl` | 1.25rem (20px) | Small heading |
| `text-2xl` | 1.5rem (24px) | Heading, kanji (mobile) |
| `text-3xl` | 1.875rem (30px) | Large heading |
| `text-4xl` | 2.25rem (36px) | Kanji (tablet) |
| `text-5xl` | 3rem (48px) | Kanji (desktop) |
| `text-6xl` | 3.75rem (60px) | Extra large |

### Kanji Font Sizes (Flashcard):

| Device | Class | Size | Pixel |
|--------|-------|------|-------|
| Mobile | `text-2xl` | 1.5rem | 24px |
| Tablet | `text-4xl` | 2.25rem | 36px |
| Desktop | `text-5xl` | 3rem | 48px |

---

## Line Heights yang Digunakan

| Class | Line Height | Penggunaan |
|-------|-------------|------------|
| `leading-tight` | 1.25 | Compact text |
| `leading-snug` | 1.375 | Kanji, hiragana |
| `leading-normal` | 1.5 | Body text |
| `leading-relaxed` | 1.625 | Comfortable reading |

---

## Emoji Font

Emoji (📚, 💾, 📤, 📥, 🌙, dll) menggunakan:

| Platform | Emoji Font |
|----------|------------|
| **macOS** | Apple Color Emoji |
| **iOS** | Apple Color Emoji |
| **Windows** | Segoe UI Emoji |
| **Android** | Noto Color Emoji |
| **Linux** | Noto Color Emoji |

---

## Mengapa Tidak Ada Custom Font?

### Keuntungan Menggunakan System Font:

1. **⚡ Performance**:
   - Tidak perlu download font file
   - Instant loading
   - Lebih cepat

2. **📱 Native Feel**:
   - Terlihat native di setiap platform
   - Familiar untuk user
   - Konsisten dengan OS

3. **🌏 Multi-language Support**:
   - System font sudah support karakter Jepang
   - Tidak perlu embed Japanese font
   - Otomatis fallback ke font yang tepat

4. **💾 Bandwidth**:
   - Tidak ada font file yang perlu di-download
   - Hemat bandwidth
   - Lebih ringan

5. **♿ Accessibility**:
   - User bisa gunakan font preference mereka
   - Support dyslexia fonts
   - Better for accessibility

---

## Jika Ingin Menambahkan Custom Font

### Opsi 1: Google Fonts (Recommended)

**Untuk Latin Text:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Untuk Japanese Text:**
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
```

**Update Tailwind Config:**
```javascript
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
                japanese: ['Noto Sans JP', 'sans-serif']
            }
        }
    }
}
```

### Opsi 2: Self-hosted Fonts

**Download font files dan tambahkan:**
```css
@font-face {
    font-family: 'CustomFont';
    src: url('/fonts/CustomFont.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
}
```

### Opsi 3: Adobe Fonts / Typekit

```html
<link rel="stylesheet" href="https://use.typekit.net/xxx.css">
```

---

## Rekomendasi Font untuk Japanese App

### Best Free Fonts:

1. **Noto Sans JP** (Google Fonts)
   - ✅ Free
   - ✅ Open source
   - ✅ Excellent Japanese support
   - ✅ Multiple weights
   - ✅ Good readability

2. **M PLUS Rounded 1c** (Google Fonts)
   - ✅ Free
   - ✅ Friendly, rounded style
   - ✅ Good for learning apps
   - ✅ Multiple weights

3. **Kosugi Maru** (Google Fonts)
   - ✅ Free
   - ✅ Rounded, friendly
   - ✅ Good for flashcards
   - ✅ Easy to read

### Best Paid Fonts:

1. **Hiragino Sans**
   - ✅ Professional
   - ✅ Excellent readability
   - ✅ Native on macOS/iOS
   - ❌ Paid license

2. **Yu Gothic**
   - ✅ Modern
   - ✅ Good readability
   - ✅ Native on Windows
   - ❌ Paid license

---

## Font Loading Strategy

Jika menambahkan custom font, gunakan strategi ini:

### 1. Font Display: Swap
```css
font-display: swap;
```
- Show system font first
- Swap to custom font when loaded
- No invisible text

### 2. Preconnect
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```
- Faster font loading
- Reduce latency

### 3. Subset Fonts
```
?family=Noto+Sans+JP:wght@400;700&subset=japanese
```
- Only load Japanese characters
- Smaller file size
- Faster loading

---

## Current Font Rendering

### Kanji Display:
```css
font-size: 24px (mobile) / 36px (tablet) / 48px (desktop)
font-weight: 700 (bold)
line-height: 1.375 (leading-snug)
```

### Hiragana Display:
```css
font-size: 24px (mobile) / 36px (tablet) / 48px (desktop)
font-weight: 700 (bold)
line-height: 1.375 (leading-snug)
```

### Body Text:
```css
font-size: 16px (base)
font-weight: 400 (normal)
line-height: 1.5 (leading-normal)
```

---

## Browser Font Rendering

### Anti-aliasing:

Tailwind CSS default menggunakan:
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

Ini membuat font terlihat lebih smooth dan crisp di semua browser.

---

## Kesimpulan

### Font yang Digunakan:
- **System Font Stack** (Tailwind CSS default)
- **Platform-specific**: San Francisco (macOS/iOS), Segoe UI (Windows), Roboto (Android)
- **Japanese**: Hiragino Sans (macOS/iOS), Yu Gothic (Windows), Noto Sans CJK (Android/Linux)
- **Emoji**: Platform-specific emoji fonts

### Keuntungan:
- ✅ Fast loading (no font download)
- ✅ Native feel
- ✅ Excellent Japanese support
- ✅ Lightweight
- ✅ Accessible

### Jika Ingin Custom Font:
- Gunakan **Noto Sans JP** dari Google Fonts
- Atau **M PLUS Rounded 1c** untuk style yang lebih friendly
- Implement dengan `font-display: swap` untuk performance

---

## File yang Terkait

- `index.html` - HTML structure (no custom font defined)
- Tailwind CSS CDN - Default font stack
- Browser - Platform-specific font rendering

---

## Referensi

- [Tailwind CSS Typography](https://tailwindcss.com/docs/font-family)
- [Google Fonts - Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP)
- [System Font Stack](https://systemfontstack.com/)
