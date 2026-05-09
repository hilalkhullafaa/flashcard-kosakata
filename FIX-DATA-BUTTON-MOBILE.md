# Fix: Tambah Tombol Data di Mobile View

## Tanggal
10 Mei 2026

## Masalah
Tombol "Data" (Export/Import) tidak muncul di mobile view, hanya muncul di desktop.

---

## Solusi

### Perubahan di `index.html`

#### Sebelum:
```html
<!-- Export/Import Dropdown (Desktop only) -->
<div class="hidden sm:block relative">
    <button id="data-menu-btn">💾 Data ▼</button>
    ...
</div>
```

#### Sesudah:
```html
<!-- Export/Import Dropdown (Desktop) -->
<div class="hidden sm:block relative">
    <button id="data-menu-btn">💾 Data ▼</button>
    ...
</div>

<!-- Export/Import Dropdown (Mobile) -->
<div class="sm:hidden relative">
    <button id="data-menu-btn-mobile">💾</button>
    ...
</div>
```

### Perubahan di `js/main.js`

Menambahkan event listeners untuk tombol mobile:
- `data-menu-btn-mobile` - Toggle dropdown menu
- `export-btn-mobile` - Export flashcards
- `import-btn-mobile` - Import flashcards

---

## Implementasi

### 1. Tombol Mobile (Icon Only)
- **Display**: Icon 💾 saja (tanpa text "Data")
- **Ukuran**: Sama dengan theme toggle button
- **Posisi**: Di header, sebelah theme toggle
- **Visibility**: Hanya muncul di mobile (`sm:hidden`)

### 2. Dropdown Menu Mobile
- **Konten**: Export Data & Import Data
- **Posisi**: Absolute, right-aligned
- **Style**: Sama dengan desktop version
- **Behavior**: Toggle on click, close on outside click

### 3. Event Listeners
- **Desktop**: `data-menu-btn`, `export-btn`, `import-btn`
- **Mobile**: `data-menu-btn-mobile`, `export-btn-mobile`, `import-btn-mobile`
- **Shared**: `import-file-input` (digunakan oleh desktop & mobile)

---

## Tampilan

### Mobile View:
```
[📚 FLASHCARD JAPAN]  [💾] [🌙]
                       ↑
                  Tombol Data
```

### Desktop View:
```
[📚 FLASHCARD JAPAN]  [+ Tambah] [💾 Data ▼] [🌙]
                                    ↑
                               Tombol Data
```

---

## Responsive Behavior

| Breakpoint | Tombol Data |
|------------|-------------|
| Mobile (<640px) | Icon only (💾) |
| Desktop (≥640px) | Icon + Text (💾 Data ▼) |

---

## File yang Dimodifikasi

1. **index.html**
   - Tambah tombol data untuk mobile
   - Tambah dropdown menu untuk mobile
   - ID baru: `data-menu-btn-mobile`, `data-menu-mobile`, `export-btn-mobile`, `import-btn-mobile`

2. **js/main.js**
   - Update `setupEventListeners()`
   - Tambah event listeners untuk tombol mobile
   - Tambah close menu on outside click untuk mobile

---

## Testing Checklist

### Mobile View:
- ✅ Tombol 💾 muncul di header
- ✅ Click tombol membuka dropdown
- ✅ Dropdown berisi Export & Import
- ✅ Export berfungsi
- ✅ Import berfungsi
- ✅ Click outside menutup dropdown

### Desktop View:
- ✅ Tombol "💾 Data ▼" muncul di header
- ✅ Tombol mobile tidak muncul
- ✅ Semua fungsi tetap berfungsi

### Responsive:
- ✅ Transisi smooth dari mobile ke desktop
- ✅ Tidak ada tombol duplikat
- ✅ Layout tidak rusak

---

## Kesimpulan

Tombol Data sekarang tersedia di mobile view dengan:
- ✅ Icon only untuk menghemat space
- ✅ Dropdown menu yang sama dengan desktop
- ✅ Fungsi export/import yang sama
- ✅ Responsive design yang baik

User mobile sekarang bisa export/import flashcard dengan mudah! 📱
