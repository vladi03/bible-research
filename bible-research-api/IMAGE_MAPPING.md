# Image Upload and Cocktail Mapping Documentation

## Overview
This document explains the image upload system that maps local images to cocktail documents in Firestore and uploads them to Google Storage.

## Current Image Inventory

### Images Available for Upload
```
data/images/
├── bloodyMary_1.png (2.3MB)    → Bloody Mary*
├── bloodyMary_2.png (1.6MB)    → Bloody Mary*
├── cosmos_1.png (489B)         → Cosmopolitan*
├── cosmos_2.png (489B)         → Cosmopolitan*
├── marg_2.png (2.1MB)          → Margarita ✅
├── Marg.png (1.3MB)            → Margarita ✅
├── manahattan_1.png (1.8MB)    → Manhattan*
├── manahattan_2.png (1.2MB)    → Manhattan*
├── martini_1.png (2.0MB)       → Martini*
├── martini_2.png (2.1MB)       → Martini*
├── old_fashioned_1.png (1.4MB) → Old Fashioned ✅
├── old_fashioned_2.png (1.4MB) → Old Fashioned ✅
├── whiskeySour_1.png (489B)    → Whiskey Sour*
└── whiskeySour_2.png (489B)    → Whiskey Sour*
```

**Legend:**
- ✅ = Cocktail exists in current dataset, will be linked
- * = Cocktail not in current dataset, images uploaded but not linked

## Current Cocktail Dataset

Based on `data/cocktails.json`, you currently have these cocktails:

| ID | Name | Images Available | Status |
|----|------|------------------|---------|
| 1 | Margarita | marg_2.png, Marg.png | ✅ Will be linked |
| 2 | Mojito | None | ❌ No images |
| 3 | Old Fashioned | old_fashioned_1.png, old_fashioned_2.png | ✅ Will be linked |
| 4 | Negroni | None | ❌ No images |
| 5 | Daiquiri | None | ❌ No images |

## Image Mapping Logic

The script uses filename pattern matching to map images to cocktails:

```javascript
const IMAGE_MAPPING = {
    // Existing cocktails in dataset
    'marg': { cocktailName: 'Margarita', cocktailId: 1 },
    'old_fashioned': { cocktailName: 'Old Fashioned', cocktailId: 3 },
    
    // Future cocktails (not yet in dataset but have images)
    'bloodyMary': { cocktailName: 'Bloody Mary', cocktailId: null },
    'cosmos': { cocktailName: 'Cosmopolitan', cocktailId: null },
    'manahattan': { cocktailName: 'Manhattan', cocktailId: null },
    'martini': { cocktailName: 'Martini', cocktailId: null },
    'whiskeySour': { cocktailName: 'Whiskey Sour', cocktailId: null }
};
```

## Upload Process

### What the Script Does:

1. **Scans Images**: Reads all image files from `data/images/`
2. **Pattern Matching**: Matches filenames to cocktail identifiers
3. **Google Storage Upload**: Uploads images to `cocktail-images/{cocktail-id}/{filename}`
4. **Firestore Update**: Updates existing cocktail documents with new image URLs
5. **Comprehensive Reporting**: Shows what was mapped, uploaded, and any issues

### Storage Structure:
```
Google Storage Bucket: gs://your-project.appspot.com/
└── cocktail-images/
    ├── marg/
    │   ├── marg_2.png
    │   └── Marg.png
    ├── old_fashioned/
    │   ├── old_fashioned_1.png
    │   └── old_fashioned_2.png
    ├── bloodyMary/
    │   ├── bloodyMary_1.png
    │   └── bloodyMary_2.png
    └── [other cocktails...]
```

### Firestore Document Updates:

For existing cocktails (Margarita, Old Fashioned), the script will update:

```javascript
{
  // ... existing fields ...
  "imageUrls": [
    "https://storage.googleapis.com/your-bucket/cocktail-images/marg/marg_2.png",
    "https://storage.googleapis.com/your-bucket/cocktail-images/marg/Marg.png"
  ],
  "image": "https://storage.googleapis.com/your-bucket/cocktail-images/marg/marg_2.png", // First image as primary
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

## Usage

### Running the Script:

```bash
# Navigate to functions directory
cd functions

# Run the upload script
npm run uploadImages
```

### Expected Output:

```
🚀 Starting image upload and cocktail update process...
📸 Found 14 image files to process

🍸 Processing Margarita (2 images)...
Uploading data/images/marg_2.png to cocktail-images/marg/marg_2.png...
✅ Uploaded: https://storage.googleapis.com/your-bucket/cocktail-images/marg/marg_2.png
✅ Updated cocktail "Margarita" with 2 new images

============================================================
📊 IMAGE MAPPING REPORT
============================================================

🎯 SUCCESSFULLY MAPPED & UPLOADED:
  ✅ marg_2.png → Margarita (ID: 1)
     URL: https://storage.googleapis.com/your-bucket/cocktail-images/marg/marg_2.png
  ✅ Marg.png → Margarita (ID: 1)
     URL: https://storage.googleapis.com/your-bucket/cocktail-images/marg/Marg.png

⚠️ UPLOADED BUT NOT MAPPED (cocktails not in dataset):
  📁 bloodyMary_1.png → Bloody Mary (Cocktail not in current dataset)
     URL: https://storage.googleapis.com/your-bucket/cocktail-images/bloodyMary/bloodyMary_1.png
     💡 Add this cocktail to your dataset to complete the mapping

📋 SUMMARY:
  • Total images processed: 14
  • Successfully uploaded: 14
  • Mapped to existing cocktails: 4
  • Awaiting cocktail data: 10
  • Failed uploads: 0
```

## Future Cocktail Integration

When you add more cocktails to your dataset, you can:

1. **Add cocktail data** to `cocktails.json` with these names:
   - Bloody Mary
   - Cosmopolitan  
   - Manhattan
   - Martini
   - Whiskey Sour

2. **Update the mapping** in `uploadImagesAndUpdateCocktails.js`:
   ```javascript
   'bloodyMary': { cocktailName: 'Bloody Mary', cocktailId: 6 },
   'cosmos': { cocktailName: 'Cosmopolitan', cocktailId: 7 },
   // etc...
   ```

3. **Re-run the script** to link existing uploaded images to new cocktails

## Error Handling

The script handles various error scenarios:

- **Missing images**: Logs warning, continues processing
- **Upload failures**: Logs error, continues with other images
- **Firestore update failures**: Logs error, marks as failed
- **Unknown filename patterns**: Logs warning, skips file
- **Network issues**: Retries and reports failures

## File Requirements

- **Image formats**: PNG, JPG, JPEG, GIF, WebP
- **Firebase Admin SDK**: Must be initialized with Storage permissions
- **Google Storage bucket**: Must exist and be accessible
- **Firestore permissions**: Read/write access to 'cocktails' collection

## Security Notes

- Images are made publicly readable after upload
- Cache headers set to 1 year for performance
- Firestore documents updated with server timestamps
- No sensitive data exposed in image URLs 