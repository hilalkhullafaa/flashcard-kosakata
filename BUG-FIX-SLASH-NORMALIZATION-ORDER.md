# Bug Fix: Slash Normalization - Order Independence

## Problem
The previous normalization implementation only took the first part before "/" which caused issues when the same vocabulary was entered in different orders:

**Example:**
- User creates: `お国/くに` → normalized to `お国`
- User creates: `くに/お国` → normalized to `くに`
- Result: **NOT detected as duplicate** ❌ (because `お国 ≠ くに`)

## Root Cause
The `normalizeField()` and `normalizeIdentifier()` functions only extracted the first part before "/" without considering that the same vocabulary could be written in different orders.

```javascript
// OLD IMPLEMENTATION (PROBLEMATIC)
normalizeField(value) {
    if (trimmed.includes('/')) {
        return trimmed.split('/')[0].trim(); // Only takes first part!
    }
    return trimmed;
}
```

## Solution
Modified the normalization logic to:
1. **Split** the value by "/"
2. **Sort** all parts alphabetically
3. **Join** with "|" separator

This ensures that regardless of order, the same vocabulary always produces the same normalized value.

```javascript
// NEW IMPLEMENTATION (FIXED)
normalizeField(value) {
    if (trimmed.includes('/')) {
        const parts = trimmed.split('/').map(part => part.trim()).filter(part => part !== '');
        return parts.sort().join('|'); // Sort to ensure consistent order!
    }
    return trimmed;
}
```

## Examples

### Duplicate Detection
| Input 1 | Normalized 1 | Input 2 | Normalized 2 | Detected? |
|---------|--------------|---------|--------------|-----------|
| `お国/くに` | `お国\|くに` | `くに/お国` | `お国\|くに` | ✅ YES |
| `お国/くに` | `お国\|くに` | `お国` | `お国` | ❌ NO (different) |
| `A/B/C` | `A\|B\|C` | `C/A/B` | `A\|B\|C` | ✅ YES |
| `A/B/C` | `A\|B\|C` | `B/C/A` | `A\|B\|C` | ✅ YES |

### Progress Tracking
Same logic applies to progress tracking - vocabulary with same parts in different orders will be counted as the same unique vocabulary.

## Files Modified

### 1. `js/flashcard-manager.js`
- Updated `normalizeField()` method
- Now handles order-independent normalization for duplicate checking

### 2. `js/progress-tracker.js`
- Updated `normalizeIdentifier()` method
- Now handles order-independent normalization for progress calculation

## Testing Scenarios

### Test Case 1: Order Variation
1. Create flashcard: Kanji=`お国/くに`, Hiragana=`おくに`
2. Try to create: Kanji=`くに/お国`, Hiragana=`おくに`
3. **Expected**: Duplicate notification appears ✅

### Test Case 2: Multiple Parts
1. Create flashcard: Kanji=`A/B/C`, Hiragana=`abc`
2. Try to create: Kanji=`C/A/B`, Hiragana=`abc`
3. **Expected**: Duplicate notification appears ✅

### Test Case 3: Single Value vs Multiple
1. Create flashcard: Kanji=`お国`, Hiragana=`おくに`
2. Try to create: Kanji=`お国/くに`, Hiragana=`おくに`
3. **Expected**: No duplicate (different values) ✅

### Test Case 4: Progress Tracking
1. Create flashcard: Hiragana=`A/B` in Chapter 1
2. Create flashcard: Hiragana=`B/A` in Chapter 2
3. **Expected**: Progress shows 1 unique vocabulary (not 2) ✅

## Benefits
1. ✅ **Order-independent**: `A/B` and `B/A` are treated as the same
2. ✅ **Consistent**: Same vocabulary always produces same normalized value
3. ✅ **Accurate duplicate detection**: Prevents duplicate entries regardless of order
4. ✅ **Accurate progress tracking**: Counts unique vocabulary correctly

## Technical Details

### Normalization Algorithm
```
Input: "くに/お国/国"
↓
Split by "/": ["くに", "お国", "国"]
↓
Trim each part: ["くに", "お国", "国"]
↓
Filter empty: ["くに", "お国", "国"]
↓
Sort alphabetically: ["お国", "くに", "国"]
↓
Join with "|": "お国|くに|国"
```

### Why Use "|" as Separator?
- "/" is already used in the original data
- "|" is unlikely to appear in Japanese text
- Makes it clear this is a normalized value (not original data)

## Impact
- **Duplicate Detection**: More accurate, catches order variations
- **Progress Tracking**: More accurate, counts unique vocabulary correctly
- **User Experience**: Prevents accidental duplicate entries
- **Data Integrity**: Maintains consistency across the application

## Date
May 10, 2026
