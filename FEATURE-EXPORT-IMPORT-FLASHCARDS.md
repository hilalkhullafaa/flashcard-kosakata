# Feature: Export & Import Flashcards

## Tanggal
10 Mei 2026

## Deskripsi Fitur
Menambahkan kemampuan untuk **Export** (save) dan **Import** (load) dataset flashcard dari/ke file JSON. Fitur ini berguna untuk:
- 📦 Backup data flashcard
- 🔄 Transfer data antar device
- 📤 Share dataset dengan teman
- 💾 Simpan data secara permanen di luar browser

---

## Fitur yang Ditambahkan

### 1. Export Flashcards
- Download semua flashcard sebagai file JSON
- Format file: `flashcards-backup-YYYY-MM-DD.json`
- Include metadata: version, export date, total flashcards
- Pretty formatted JSON (readable)

### 2. Import Flashcards
- Upload file JSON untuk import flashcard
- **2 Mode Import**:
  - **Replace Mode**: Hapus semua data lama, ganti dengan data baru
  - **Merge Mode**: Gabungkan data baru dengan data lama (skip duplikat berdasarkan ID)
- Validasi file format dan struktur data
- Error handling untuk file invalid

---

## Implementasi

### 1. Storage Manager (`js/storage-manager.js`)

#### Fungsi Baru:

**`exportFlashcards()`**
```javascript
/**
 * Export flashcards to JSON file
 * Downloads flashcards as a JSON file
 * @returns {boolean} - Success status
 */
exportFlashcards()
```

**Features:**
- Create export data with metadata
- Format JSON dengan pretty print
- Create blob dan trigger download
- Automatic filename dengan tanggal

**`importFlashcards(file, merge)`**
```javascript
/**
 * Import flashcards from JSON file
 * @param {File} file - JSON file containing flashcards
 * @param {boolean} merge - If true, merge with existing data
 * @returns {Promise<Object>} - Import result with statistics
 */
async importFlashcards(file, merge = false)
```

**Features:**
- Validate file type (.json)
- Parse dan validate JSON structure
- Validate flashcard data structure
- Merge or replace mode
- Skip duplicates in merge mode
- Return statistics (total, added, skipped)

**`readFileAsText(file)`**
```javascript
/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} - File content as text
 */
readFileAsText(file)
```

---

### 2. Flashcard Manager (`js/flashcard-manager.js`)

#### Fungsi Baru:

**`exportFlashcards()`**
```javascript
/**
 * Export flashcards to JSON file
 * @returns {Object} - Result object with success status
 */
exportFlashcards()
```

**`importFlashcards(file, merge)`**
```javascript
/**
 * Import flashcards from JSON file
 * @param {File} file - JSON file containing flashcards
 * @param {boolean} merge - If true, merge with existing data
 * @returns {Promise<Object>} - Result object with success status and statistics
 */
async importFlashcards(file, merge = false)
```

---

### 3. UI Components (`index.html`)

#### Header - Data Menu Dropdown:

```html
<div class="hidden sm:block relative">
    <button id="data-menu-btn">
        💾 Data ▼
    </button>
    <div id="data-menu" class="hidden ...">
        <button id="export-btn">📤 Export Data</button>
        <button id="import-btn">📥 Import Data</button>
    </div>
</div>
```

#### Hidden File Input:

```html
<input type="file" id="import-file-input" accept=".json" class="hidden" />
```

---

### 4. Main Application (`js/main.js`)

#### Event Listeners:

**Data Menu Toggle:**
- Click button to show/hide menu
- Click outside to close menu
- Arrow rotation animation

**Export Button:**
- Click to trigger export
- Show success/error notification

**Import Button:**
- Click to open file picker
- Show import options modal
- Perform import with selected mode

#### Fungsi Baru:

**`handleExport()`**
```javascript
/**
 * Handle export flashcards
 */
handleExport()
```

**`handleImport(file)`**
```javascript
/**
 * Handle import flashcards
 */
async handleImport(file)
```

**`showImportOptionsModal(file)`**
```javascript
/**
 * Show import options modal
 */
showImportOptionsModal(file)
```

**`performImport(file, merge)`**
```javascript
/**
 * Perform import with selected mode
 */
async performImport(file, merge)
```

**`showNotification(message, type)`**
```javascript
/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - 'success', 'error', or 'info'
 */
showNotification(message, type = 'info')
```

---

## Format File JSON

### Export Format:

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

### Import Format (Accepted):

**Format 1 (With Metadata):**
```json
{
  "version": "1.0",
  "flashcards": [...]
}
```

**Format 2 (Array Only):**
```json
[
  {
    "id": "...",
    "hiragana": "...",
    ...
  }
]
```

---

## Validasi

### File Validation:
- ✅ File extension must be `.json`
- ✅ File must contain valid JSON
- ✅ JSON must be array or object with `flashcards` property

### Data Validation:
- ✅ Flashcards must be an array
- ✅ Array must not be empty
- ✅ Each flashcard must have required fields:
  - `hiragana` (required)
  - `meaning` (required)
  - `romaji` (required)
  - `source` (required)
  - `chapters` (required, array)

---

## User Flow

### Export Flow:

1. User clicks **"💾 Data"** button
2. Dropdown menu appears
3. User clicks **"📤 Export Data"**
4. Browser downloads JSON file
5. Success notification appears

### Import Flow:

1. User clicks **"💾 Data"** button
2. Dropdown menu appears
3. User clicks **"📥 Import Data"**
4. File picker opens
5. User selects JSON file
6. Import options modal appears:
   - **🔄 Replace (Ganti Semua)**: Hapus data lama, ganti dengan data baru
   - **➕ Merge (Gabungkan)**: Tambahkan data baru ke data lama
7. User selects mode
8. Import process starts
9. Success/error notification appears
10. Main view refreshes with new data

---

## Error Handling

### Export Errors:
- ❌ No flashcards to export
- ❌ Storage error
- ❌ Download failed

### Import Errors:
- ❌ Invalid file type (not .json)
- ❌ Invalid JSON format
- ❌ Invalid flashcard structure
- ❌ Missing required fields
- ❌ Empty flashcard array
- ❌ File read error

---

## Notifications

### Success Notifications:
- ✅ "Flashcards exported successfully!"
- ✅ "Successfully imported X flashcards"
- ✅ "Successfully imported X flashcards (Y duplicates skipped)"

### Error Notifications:
- ❌ "No flashcards to export. Please add some flashcards first."
- ❌ "Invalid file type. Please select a JSON file."
- ❌ "Invalid JSON file. Please check the file format."
- ❌ "Invalid flashcard data format."
- ❌ "No flashcards found in the file."
- ❌ "Failed to export/import flashcards."

### Info Notifications:
- ⏳ "Importing flashcards..."

---

## UI Components

### Data Menu Button:
- Icon: 💾
- Text: "Data"
- Arrow: ▼ (rotates when open)
- Position: Header, desktop only
- Style: Gray background, white text

### Dropdown Menu:
- Position: Absolute, right-aligned
- Background: White (light) / Slate-800 (dark)
- Border: Gray-200 (light) / Slate-700 (dark)
- Shadow: xl
- Items:
  - 📤 Export Data
  - 📥 Import Data

### Import Options Modal:
- Title: "📥 Import Flashcards"
- Description: "Pilih mode import:"
- Options:
  - 🔄 Replace (Ganti Semua)
  - ➕ Merge (Gabungkan)
- Cancel button

### Notification:
- Position: Fixed, top-right
- Colors:
  - Success: Green-500
  - Error: Red-500
  - Info: Blue-500 / Indigo-600 (dark)
- Animation: Slide in from right
- Duration: 3 seconds
- Auto-dismiss

---

## Testing Checklist

### Export:
- ✅ Export with flashcards
- ✅ Export with no flashcards (error)
- ✅ File downloads correctly
- ✅ Filename includes date
- ✅ JSON format is valid
- ✅ Metadata is included
- ✅ All flashcard data is included

### Import - Replace Mode:
- ✅ Import valid JSON file
- ✅ Old data is replaced
- ✅ New data is loaded
- ✅ Main view refreshes
- ✅ Success notification appears

### Import - Merge Mode:
- ✅ Import valid JSON file
- ✅ New flashcards are added
- ✅ Duplicates are skipped
- ✅ Old data is preserved
- ✅ Statistics are correct
- ✅ Success notification shows counts

### Import - Error Cases:
- ✅ Invalid file type (.txt, .pdf)
- ✅ Invalid JSON format
- ✅ Empty flashcard array
- ✅ Missing required fields
- ✅ Corrupted data
- ✅ Error notifications appear

### UI:
- ✅ Data menu button works
- ✅ Dropdown opens/closes
- ✅ Arrow rotates
- ✅ Click outside closes menu
- ✅ Export button works
- ✅ Import button opens file picker
- ✅ Import options modal appears
- ✅ Notifications appear and dismiss

---

## File yang Dimodifikasi

1. **js/storage-manager.js**
   - Added `exportFlashcards()`
   - Added `importFlashcards(file, merge)`
   - Added `readFileAsText(file)`

2. **js/flashcard-manager.js**
   - Added `exportFlashcards()`
   - Added `importFlashcards(file, merge)`

3. **js/main.js**
   - Updated `setupEventListeners()` - added data menu, export, import listeners
   - Added `handleExport()`
   - Added `handleImport(file)`
   - Added `showImportOptionsModal(file)`
   - Added `performImport(file, merge)`
   - Added `showNotification(message, type)`

4. **index.html**
   - Added data menu dropdown in header
   - Added export button
   - Added import button
   - Added hidden file input

---

## Keuntungan Fitur Ini

### Untuk User:
- 💾 **Backup Data**: Simpan data flashcard secara permanen
- 🔄 **Transfer Data**: Pindahkan data antar device dengan mudah
- 📤 **Share Dataset**: Bagikan dataset dengan teman atau komunitas
- 🛡️ **Data Safety**: Tidak khawatir kehilangan data jika clear browser
- 📱 **Multi-Device**: Gunakan dataset yang sama di berbagai device

### Untuk Developer:
- 🧪 **Testing**: Mudah untuk load test data
- 🐛 **Debugging**: Export data untuk analisis
- 📊 **Data Migration**: Mudah untuk migrate data format
- 🔧 **Maintenance**: Backup sebelum update atau maintenance

---

## Catatan Penting

### Merge Mode:
- Duplicate detection berdasarkan **ID flashcard**
- Jika ID sama, flashcard di-skip (tidak di-update)
- Jika ingin update flashcard existing, gunakan Replace mode

### Replace Mode:
- **HATI-HATI**: Semua data lama akan dihapus
- Pastikan sudah backup data lama sebelum replace
- Tidak bisa di-undo

### File Size:
- JSON file size tergantung jumlah flashcard
- ~1KB per flashcard (average)
- 1000 flashcards ≈ 1MB

### Browser Compatibility:
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Full support

---

## Future Enhancements

Possible improvements:
- 📊 Export statistics (progress, memory status)
- 🔍 Preview import data before importing
- ⚙️ Selective import (choose which flashcards to import)
- 📁 Export by source or chapter
- 🗜️ Compress export file (ZIP)
- ☁️ Cloud sync integration
- 📤 Export to CSV/Excel format
- 🔗 Share via URL/QR code

---

## Kesimpulan

Fitur Export/Import flashcards berhasil ditambahkan dengan:
- ✅ Export ke JSON file
- ✅ Import dari JSON file
- ✅ 2 mode import (Replace & Merge)
- ✅ Validasi file dan data
- ✅ Error handling lengkap
- ✅ UI yang user-friendly
- ✅ Notifications untuk feedback
- ✅ Dokumentasi lengkap

User sekarang bisa backup, transfer, dan share dataset flashcard dengan mudah! 🎉
