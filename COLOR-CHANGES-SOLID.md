# Color Changes - Solid Tailwind Colors

## Warna Baru (Solid)

### Biru (Blue)
- **Before**: `bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600`
- **After**: `bg-blue-500 hover:bg-blue-600`

### Kuning (Yellow) - Ganti Hijau
- **Before**: `bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600`
- **After**: `bg-yellow-500 hover:bg-yellow-600`

### Merah (Red)
- **Before**: `bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600`
- **After**: `bg-red-500 hover:bg-red-600`

## Files to Update

### js/main.js
1. Line 183: viewAllButton - Blue
2. Line 189: guessingButton - Green → Yellow
3. Line 344: viewAllButton (source) - Blue
4. Line 360: gameButton (source) - Green → Yellow
5. Line 417: viewButton (chapter) - Blue
6. Line 433: gameButton (chapter) - Green → Yellow
7. Line 522: submitButton (form) - Blue
8. Line 778: editButton - Blue
9. Line 938: numberBadge - Blue
10. Line 994: closeFooterButton - Blue
11. Line 1342: progressBarFill - Blue
12. Line 1397: submitButton (guess) - Blue

### js/display-controller.js
1. Line 107: checklistBadge - Green → Yellow
2. Line 220: rememberedButton - Green → Yellow

### index.html
1. Add flashcard button - Blue

## Tailwind Color Reference

### Blue-500
- Hex: `#3B82F6`
- RGB: `59, 130, 246`

### Blue-600 (hover)
- Hex: `#2563EB`
- RGB: `37, 99, 235`

### Yellow-500
- Hex: `#EAB308`
- RGB: `234, 179, 8`

### Yellow-600 (hover)
- Hex: `#CA8A04`
- RGB: `202, 138, 4`

### Red-500
- Hex: `#EF4444`
- RGB: `239, 68, 68`

### Red-600 (hover)
- Hex: `#DC2626`
- RGB: `220, 38, 38`
