# Quick Start: Image Upload Script

## Running the Script

```bash
# Navigate to the functions directory
cd functions

# Run the image upload script
npm run uploadImages
```

## What Will Happen

### ✅ Successfully Mapped Images (Will Update Firestore):
- `marg_2.png` & `Marg.png` → **Margarita** cocktail (ID: 1)
- `old_fashioned_1.png` & `old_fashioned_2.png` → **Old Fashioned** cocktail (ID: 3)

### 📁 Uploaded but Not Linked (Awaiting Cocktail Data):
- `bloodyMary_1.png` & `bloodyMary_2.png` → Bloody Mary (not in dataset)
- `cosmos_1.png` & `cosmos_2.png` → Cosmopolitan (not in dataset)  
- `manahattan_1.png` & `manahattan_2.png` → Manhattan (not in dataset)
- `martini_1.png` & `martini_2.png` → Martini (not in dataset)
- `whiskeySour_1.png` & `whiskeySour_2.png` → Whiskey Sour (not in dataset)

## Expected Result

**Total: 14 images**
- ✅ **4 images** will be linked to existing cocktails
- 📁 **10 images** will be uploaded but await cocktail data
- 🚀 **All images** will be available in Google Storage

## Google Storage URLs

After upload, images will be accessible at:
```
https://storage.googleapis.com/your-bucket-name/cocktail-images/marg/marg_2.png
https://storage.googleapis.com/your-bucket-name/cocktail-images/old_fashioned/old_fashioned_1.png
...etc
```

## Firestore Updates

The Margarita and Old Fashioned documents will be updated with:
```javascript
{
  "imageUrls": ["url1", "url2"],
  "image": "primary-image-url",
  "updatedAt": "timestamp"
}
```

## Next Steps

To link the remaining images:
1. Add the missing cocktails to your `data/cocktails.json`
2. Update the cocktail IDs in the script
3. Re-run the script to complete the linking 