# Skema Warna Slate + Indigo - Dark Mode

## Tanggal
7 Mei 2026

## Ringkasan
Aplikasi telah diperbarui dengan skema warna **Slate** (abu-abu gelap) dengan aksen **Indigo** (biru-ungu) untuk dark mode. Desain ini memberikan tampilan yang lebih modern, solid, dan profesional.

---

## Palet Warna Dark Mode

### 1. Background (Latar Belakang)
| Elemen | Warna | Hex Code | Tailwind Class |
|--------|-------|----------|----------------|
| **Body Background** | Slate-900 | `#0f172a` | `dark:bg-slate-900` |
| **Header/Footer** | Slate-800 | `#1e293b` | `dark:bg-slate-800` |
| **Card Background** | Slate-800 | `#1e293b` | `dark:bg-slate-800` |
| **Secondary Card** | Slate-700 | `#334155` | `dark:bg-slate-700` |

### 2. Buttons (Tombol)
| Jenis | Base | Hover | Tailwind Class |
|-------|------|-------|----------------|
| **Primary (Indigo)** | Indigo-600 (#4f46e5) | Indigo-700 (#4338ca) | `dark:bg-indigo-600 dark:hover:bg-indigo-700` |
| **Success/Game (Yellow)** | Yellow-600 (#ca8a04) | Yellow-700 (#a16207) | `dark:bg-yellow-600 dark:hover:bg-yellow-700` |
| **Danger (Red)** | Red-600 (#dc2626) | Red-700 (#b91c1c) | `dark:bg-red-600 dark:hover:bg-red-700` |
| **Secondary (Slate)** | Slate-700 (#334155) | Slate-600 (#475569) | `dark:bg-slate-700 dark:hover:bg-slate-600` |

### 3. Borders (Garis Tepi)
| Elemen | Warna | Hex Code | Tailwind Class |
|--------|-------|----------|----------------|
| **Card Border** | Slate-700 | `#334155` | `dark:border-slate-700` |
| **Input Border** | Slate-600 | `#475569` | `dark:border-slate-600` |
| **Focus Border** | Indigo-500 | `#6366f1` | `dark:focus:border-indigo-500` |
| **Flashcard Border** | Indigo-500 | `#6366f1` | `dark:border-indigo-500` |

### 4. Text Colors (Warna Teks)
| Jenis | Warna | Tailwind Class |
|-------|-------|----------------|
| **Primary Text** | White | `dark:text-white` |
| **Secondary Text** | Gray-400 | `dark:text-gray-400` |
| **Accent Text** | Indigo-400 | `dark:text-indigo-400` |
| **Badge Text** | Indigo-300 | `dark:text-indigo-300` |

### 5. Gradients (Gradien)
| Elemen | From | To | Tailwind Class |
|--------|------|-----|----------------|
| **Progress Card** | Slate-700 | Slate-800 | `dark:from-slate-700 dark:to-slate-800` |
| **Flashcard Back** | Indigo-900 | Slate-900 | `dark:from-indigo-900 dark:to-slate-900` |
| **Flashcard View BG** | Slate-900 | Indigo-950 | `dark:from-slate-900 dark:to-indigo-950` |

### 6. Special Elements
| Elemen | Warna | Hex Code | Tailwind Class |
|--------|-------|----------|----------------|
| **Progress Bar Fill** | Indigo-600 | `#4f46e5` | `dark:bg-indigo-600` |
| **Progress Bar BG** | Slate-700 | `#334155` | `dark:bg-slate-700` |
| **Badge Background** | Slate-700 | `#334155` | `dark:bg-slate-700` |
| **Theme Toggle** | Slate-700 | `#334155` | `dark:bg-slate-700` |

---

## Perubahan yang Diterapkan

### File: index.html (5 lokasi)

1. **Body Background**
   ```html
   <!-- BEFORE -->
   dark:bg-gray-900
   
   <!-- AFTER -->
   dark:bg-slate-900
   ```

2. **Header Background**
   ```html
   <!-- BEFORE -->
   dark:bg-gray-800 dark:border-gray-700
   
   <!-- AFTER -->
   dark:bg-slate-800 dark:border-slate-700
   ```

3. **Footer Background**
   ```html
   <!-- BEFORE -->
   dark:bg-gray-800 dark:border-gray-700
   
   <!-- AFTER -->
   dark:bg-slate-800 dark:border-slate-700
   ```

4. **Desktop Add Button**
   ```html
   <!-- BEFORE -->
   dark:bg-blue-600 dark:hover:bg-blue-700
   
   <!-- AFTER -->
   dark:bg-indigo-600 dark:hover:bg-indigo-700
   ```

5. **Mobile FAB Button**
   ```html
   <!-- BEFORE -->
   dark:bg-blue-600 dark:hover:bg-blue-700
   
   <!-- AFTER -->
   dark:bg-indigo-600 dark:hover:bg-indigo-700
   ```

6. **Theme Toggle Button**
   ```html
   <!-- BEFORE -->
   dark:bg-gray-700 dark:hover:bg-gray-600
   
   <!-- AFTER -->
   dark:bg-slate-700 dark:hover:bg-slate-600
   ```

---

### File: js/main.js (30+ lokasi)

#### Background & Cards
1. **Overall Progress Container**: `dark:bg-slate-800 dark:border-slate-700`
2. **Progress Card Gradient**: `dark:from-slate-700 dark:to-slate-800 dark:border-slate-600`
3. **Source Section**: `dark:bg-slate-800 dark:border-slate-700`
4. **Source Section Hover**: `dark:hover:bg-slate-700`
5. **Chapter Card**: `dark:bg-slate-800 dark:border-slate-700`
6. **Flashcard Form Modal**: `dark:bg-slate-800`
7. **Manage Flashcards Modal**: `dark:bg-slate-800`
8. **Remembered Vocabulary Modal**: `dark:bg-slate-800`
9. **Guessing Game Container**: `dark:bg-slate-800 dark:border-slate-700`

#### Buttons
10. **View All Button (Main)**: `dark:bg-indigo-600 dark:hover:bg-indigo-700`
11. **View All Button (Source)**: `dark:bg-indigo-600 dark:hover:bg-indigo-700`
12. **View Button (Chapter)**: `dark:bg-indigo-600 dark:hover:bg-indigo-700`
13. **Edit Button**: `dark:bg-indigo-600 dark:hover:bg-indigo-700`
14. **Submit Button (Form)**: `dark:bg-indigo-600 dark:hover:bg-indigo-700`
15. **Submit Button (Guess)**: `dark:bg-indigo-600 dark:hover:bg-indigo-700`
16. **Close Footer Button**: `dark:bg-indigo-600 dark:hover:bg-indigo-700`
17. **Manage Button (Source)**: `dark:bg-slate-700 dark:hover:bg-slate-600`
18. **Manage Button (Chapter)**: `dark:bg-slate-700 dark:hover:bg-slate-600`

#### Borders & Inputs
19. **Search Input**: `dark:border-slate-600 dark:bg-slate-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-500`
20. **Form Input**: `dark:border-slate-600 dark:bg-slate-700 dark:focus:border-indigo-500`
21. **Form Select**: `dark:border-slate-600 dark:bg-slate-700 dark:focus:border-indigo-500`
22. **Guess Input**: `dark:border-slate-600 dark:bg-slate-700 dark:focus:border-indigo-500`

#### Text & Badges
23. **Chapter Number**: `dark:text-indigo-400`
24. **Chapter Badge**: `dark:bg-slate-700 dark:text-indigo-300`
25. **Number Badge**: `dark:bg-slate-700 dark:text-indigo-300`
26. **Chapters Info**: `dark:text-indigo-400`

#### Progress & Gradients
27. **Progress Bar Fill**: `dark:bg-indigo-600`
28. **Progress Bar Background**: `dark:bg-slate-700`
29. **Count Info Background**: `dark:bg-slate-700 dark:border-slate-600`
30. **Count Info Text**: `dark:text-indigo-400`
31. **Flashcard View Gradient**: `dark:from-slate-900 dark:to-indigo-950`
32. **Item Card Gradient**: `dark:from-slate-700 dark:to-slate-800 dark:border-slate-600`
33. **Question Card**: `dark:bg-slate-800 dark:border-slate-700`
34. **Correct Answer Card**: `dark:bg-slate-800 dark:border-slate-600`

#### Modal Headers & Footers
35. **Modal Header Border**: `dark:border-slate-700`
36. **Modal Footer Border**: `dark:border-slate-700`
37. **Guessing Game Header Border**: `dark:border-slate-700`

---

### File: js/display-controller.js (3 lokasi)

1. **Flashcard Front Background**
   ```javascript
   // BEFORE
   dark:bg-gray-800 dark:border-blue-400
   
   // AFTER
   dark:bg-slate-800 dark:border-indigo-500
   ```

2. **Flashcard Back Gradient**
   ```javascript
   // BEFORE
   dark:from-purple-700 dark:to-blue-700
   
   // AFTER
   dark:from-indigo-900 dark:to-slate-900
   ```

3. **Checkmark Badge**
   ```javascript
   // BEFORE
   dark:bg-yellow-600
   
   // AFTER
   dark:bg-yellow-600 (tetap sama)
   ```

---

## Karakteristik Desain

### Warna Utama
- **Slate** (#0f172a, #1e293b, #334155): Warna dasar yang gelap, solid, dan profesional
- **Indigo** (#4f46e5, #6366f1): Aksen biru-ungu yang modern dan eye-catching

### Hierarki Visual
1. **Background Utama**: Slate-900 (paling gelap)
2. **Card/Container**: Slate-800 (sedikit lebih terang)
3. **Secondary Elements**: Slate-700 (lebih terang lagi)
4. **Aksen Interaktif**: Indigo-600 (kontras tinggi)

### Kontras
- Background gelap (Slate) dengan teks putih = kontras tinggi
- Tombol Indigo dengan background Slate = sangat menonjol
- Border Slate-700/600 = subtle tapi jelas

---

## Keuntungan Skema Warna Ini

1. **Modern & Profesional**: Slate memberikan kesan solid dan premium
2. **Kontras Tinggi**: Indigo menonjol dengan jelas di atas Slate
3. **Konsisten**: Semua elemen menggunakan palet yang sama
4. **Eye-Friendly**: Warna gelap mengurangi kelelahan mata
5. **Hierarki Jelas**: Perbedaan Slate-900/800/700 menciptakan depth
6. **Aksen Kuat**: Indigo memberikan focal point yang jelas

---

## Testing Checklist

- ✅ Body background: Slate-900
- ✅ Header/Footer: Slate-800
- ✅ Cards: Slate-800 dengan border Slate-700
- ✅ Primary buttons: Indigo-600 → Indigo-700 (hover)
- ✅ Secondary buttons: Slate-700 → Slate-600 (hover)
- ✅ Borders: Slate-700/600
- ✅ Focus states: Indigo-500
- ✅ Progress bar: Indigo-600
- ✅ Badges: Slate-700 dengan text Indigo-300
- ✅ Gradients: Slate + Indigo combinations
- ✅ Text colors: White primary, Indigo-400 accent

---

## Total Perubahan

- **index.html**: 6 perubahan
- **js/main.js**: 37+ perubahan
- **js/display-controller.js**: 3 perubahan

**Total**: 46+ perubahan warna berhasil diterapkan

---

## Catatan

Skema warna Slate + Indigo memberikan tampilan yang sangat modern dan profesional. Kombinasi abu-abu gelap (Slate) dengan aksen biru-ungu (Indigo) menciptakan kontras yang sempurna dan hierarki visual yang jelas.

Semua elemen UI sekarang mengikuti palet warna yang konsisten, memberikan pengalaman pengguna yang solid, deep, dan "doop" seperti yang diminta.

