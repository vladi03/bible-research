import admin from 'firebase-admin';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Image to cocktail mapping based on filename patterns
const IMAGE_MAPPING = {
    // Existing cocktails in dataset
    'marg': { cocktailName: 'Margarita', cocktailId: 1 },
    'old_fashioned': { cocktailName: 'Old Fashioned', cocktailId: 3 },
    
    // Future cocktails (not yet in dataset but have images)
    'bloodyMary': { cocktailName: 'Bloody Mary', cocktailId: null, note: 'Cocktail not in current dataset' },
    'cosmos': { cocktailName: 'Cosmopolitan', cocktailId: null, note: 'Cocktail not in current dataset' },
    'manahattan': { cocktailName: 'Manhattan', cocktailId: null, note: 'Cocktail not in current dataset' },
    'martini': { cocktailName: 'Martini', cocktailId: null, note: 'Cocktail not in current dataset' },
    'whiskeySour': { cocktailName: 'Whiskey Sour', cocktailId: null, note: 'Cocktail not in current dataset' }
};

/**
 * Extract cocktail identifier from image filename
 * @param {string} filename - The image filename
 * @returns {string|null} - The cocktail identifier or null if not found
 */
const extractCocktailIdentifier = (filename) => {
    const baseName = basename(filename, extname(filename));
    
    // Handle special cases
    if (baseName.toLowerCase().includes('marg')) {
        return 'marg';
    }
    
    // Extract identifier before underscore or number
    const match = baseName.match(/^([a-zA-Z]+)/);
    return match ? match[1] : null;
};

/**
 * Upload image to Google Storage
 * @param {string} localPath - Local path to the image
 * @param {string} storagePath - Path in Google Storage
 * @returns {Promise<string>} - Public URL of uploaded image
 */
const uploadImageToStorage = async (localPath, storagePath) => {
    try {
        console.log(`Uploading ${localPath} to ${storagePath}...`);
        
        const [file] = await bucket.upload(localPath, {
            destination: storagePath,
            metadata: {
                cacheControl: 'public, max-age=31536000', // 1 year cache
            },
        });
        
        // Make the file publicly readable
        await file.makePublic();
        
        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
        console.log(`✅ Uploaded: ${publicUrl}`);
        
        return publicUrl;
    } catch (error) {
        console.error(`❌ Error uploading ${localPath}:`, error);
        throw error;
    }
};

/**
 * Update cocktail document with image URLs
 * @param {number} cocktailId - The cocktail ID
 * @param {string[]} imageUrls - Array of image URLs
 */
const updateCocktailWithImages = async (cocktailId, imageUrls) => {
    try {
        // Find the cocktail document by ID
        const cocktailsSnapshot = await db.collection('cocktails')
            .where('id', '==', cocktailId)
            .limit(1)
            .get();
        
        if (cocktailsSnapshot.empty) {
            console.log(`⚠️ No cocktail found with ID ${cocktailId}`);
            return;
        }
        
        const cocktailDoc = cocktailsSnapshot.docs[0];
        const currentData = cocktailDoc.data();
        
        // Update the document with new image URLs
        const updatedData = {
            ...currentData,
            imageUrls: [...(currentData.imageUrls || []), ...imageUrls],
            // Update the main image field to the first uploaded image if not set
            image: currentData.image || imageUrls[0],
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        await cocktailDoc.ref.update(updatedData);
        console.log(`✅ Updated cocktail "${currentData.name}" with ${imageUrls.length} new images`);
        
    } catch (error) {
        console.error(`❌ Error updating cocktail ${cocktailId}:`, error);
        throw error;
    }
};

/**
 * Generate mapping report
 * @param {Object} results - Results from the upload process
 */
const generateMappingReport = (results) => {
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMAGE MAPPING REPORT');
    console.log('='.repeat(60));
    
    console.log('\n🎯 SUCCESSFULLY MAPPED & UPLOADED:');
    results.successful.forEach(item => {
        console.log(`  ✅ ${item.filename} → ${item.cocktailName} (ID: ${item.cocktailId})`);
        console.log(`     URL: ${item.url}`);
    });
    
    console.log('\n⚠️ UPLOADED BUT NOT MAPPED (cocktails not in dataset):');
    results.unmapped.forEach(item => {
        console.log(`  📁 ${item.filename} → ${item.cocktailName} (${item.note})`);
        console.log(`     URL: ${item.url}`);
        console.log(`     💡 Add this cocktail to your dataset to complete the mapping`);
    });
    
    console.log('\n❌ FAILED UPLOADS:');
    if (results.failed.length === 0) {
        console.log('  🎉 No failed uploads!');
    } else {
        results.failed.forEach(item => {
            console.log(`  ❌ ${item.filename}: ${item.error}`);
        });
    }
    
    console.log('\n📋 SUMMARY:');
    console.log(`  • Total images processed: ${results.total}`);
    console.log(`  • Successfully uploaded: ${results.successful.length + results.unmapped.length}`);
    console.log(`  • Mapped to existing cocktails: ${results.successful.length}`);
    console.log(`  • Awaiting cocktail data: ${results.unmapped.length}`);
    console.log(`  • Failed uploads: ${results.failed.length}`);
};

/**
 * Main function to upload images and update cocktails
 */
const uploadImagesAndUpdateCocktails = async () => {
    console.log('🚀 Starting image upload and cocktail update process...');
    
    try {
        const imagesPath = join(__dirname, '../../../data/images');
        const imageFiles = readdirSync(imagesPath).filter(file => {
            const ext = extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
        });
        
        console.log(`📸 Found ${imageFiles.length} image files to process`);
        
        const results = {
            total: imageFiles.length,
            successful: [],
            unmapped: [],
            failed: []
        };
        
        // Group images by cocktail
        const imageGroups = {};
        
        for (const filename of imageFiles) {
            const identifier = extractCocktailIdentifier(filename);
            if (identifier && IMAGE_MAPPING[identifier]) {
                if (!imageGroups[identifier]) {
                    imageGroups[identifier] = [];
                }
                imageGroups[identifier].push(filename);
            } else {
                console.log(`⚠️ Unknown image pattern: ${filename}`);
                results.failed.push({
                    filename,
                    error: 'Unknown filename pattern - cannot map to cocktail'
                });
            }
        }
        
        // Process each cocktail group
        for (const [identifier, filenames] of Object.entries(imageGroups)) {
            const mapping = IMAGE_MAPPING[identifier];
            const uploadedUrls = [];
            
            console.log(`\n🍸 Processing ${mapping.cocktailName} (${filenames.length} images)...`);
            
            // Upload all images for this cocktail
            for (const filename of filenames) {
                try {
                    const localPath = join(imagesPath, filename);
                    const storagePath = `cocktail-images/${identifier}/${filename}`;
                    
                    const publicUrl = await uploadImageToStorage(localPath, storagePath);
                    uploadedUrls.push(publicUrl);
                    
                    const resultItem = {
                        filename,
                        cocktailName: mapping.cocktailName,
                        cocktailId: mapping.cocktailId,
                        url: publicUrl,
                        note: mapping.note
                    };
                    
                    if (mapping.cocktailId) {
                        results.successful.push(resultItem);
                    } else {
                        results.unmapped.push(resultItem);
                    }
                    
                } catch (error) {
                    console.error(`❌ Failed to upload ${filename}:`, error);
                    results.failed.push({
                        filename,
                        error: error.message
                    });
                }
            }
            
            // Update Firestore document if cocktail exists in dataset
            if (mapping.cocktailId && uploadedUrls.length > 0) {
                try {
                    await updateCocktailWithImages(mapping.cocktailId, uploadedUrls);
                } catch (error) {
                    console.error(`❌ Failed to update cocktail ${mapping.cocktailName}:`, error);
                    // Move successful uploads to failed for this cocktail
                    const failedItems = results.successful.filter(item => 
                        item.cocktailId === mapping.cocktailId
                    );
                    results.failed.push(...failedItems.map(item => ({
                        filename: item.filename,
                        error: `Image uploaded but Firestore update failed: ${error.message}`
                    })));
                    results.successful = results.successful.filter(item => 
                        item.cocktailId !== mapping.cocktailId
                    );
                }
            }
        }
        
        // Generate and display mapping report
        generateMappingReport(results);
        
        console.log('\n🎉 Process completed!');
        
    } catch (error) {
        console.error('❌ Fatal error during upload process:', error);
        process.exit(1);
    }
    
    process.exit(0);
};

// Run the upload process
uploadImagesAndUpdateCocktails(); 