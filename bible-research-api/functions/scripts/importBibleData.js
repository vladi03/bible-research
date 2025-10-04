import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

const importCocktailData = async () => {
    console.log('Starting cocktail data import...');
    
    try {
        // Load data files from the data directory (relative to project root)
        const dataPath = join(__dirname, '../../data');
        
        // Import cocktails
        const cocktailsData = JSON.parse(readFileSync(join(dataPath, 'cocktails.json'), 'utf8'));
        console.log(`Found ${cocktailsData.length} cocktails to import`);
        
        // Import ingredients (note: filename has typo 'ingrdients')
        const ingredientsData = JSON.parse(readFileSync(join(dataPath, 'ingredients.json'), 'utf8'));
        console.log(`Found ${ingredientsData.length} ingredients to import`);
        
        // Import categories
        const categoriesData = JSON.parse(readFileSync(join(dataPath, 'categories.json'), 'utf8'));
        console.log(`Found ${categoriesData.length} categories to import`);
        
        // Import glasses
        const glassesData = JSON.parse(readFileSync(join(dataPath, 'glasses.json'), 'utf8'));
        console.log(`Found ${glassesData.length} glass types to import`);

        // Batch write operations
        let batch = db.batch();
        let batchCount = 0;
        const maxBatchSize = 500;

        // Helper function to commit batch when it gets too large
        const commitBatchIfNeeded = async () => {
            if (batchCount >= maxBatchSize) {
                await batch.commit();
                console.log(`Committed batch of ${batchCount} items`);
                batch = db.batch();
                batchCount = 0;
            }
        };

        // Import categories first
        console.log('Importing categories...');
        for (const category of categoriesData) {
            const docRef = db.collection('categories').doc();
            batch.set(docRef, {
                ...category,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            batchCount++;
            await commitBatchIfNeeded();
        }

        // Import ingredients
        console.log('Importing ingredients...');
        for (const ingredient of ingredientsData) {
            const docRef = db.collection('ingredients').doc();
            batch.set(docRef, {
                ...ingredient,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            batchCount++;
            await commitBatchIfNeeded();
        }

        // Import glasses
        console.log('Importing glasses...');
        for (const glass of glassesData) {
            const docRef = db.collection('glasses').doc();
            batch.set(docRef, {
                ...glass,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            batchCount++;
            await commitBatchIfNeeded();
        }

        // Import cocktails
        console.log('Importing cocktails...');
        for (const cocktail of cocktailsData) {
            const docRef = db.collection('cocktails').doc();
            
            // Process the cocktail data to ensure it's in the right format
            const processedCocktail = {
                ...cocktail,
                // Ensure ingredients is an array of objects
                ingredients: Array.isArray(cocktail.ingredients) 
                    ? cocktail.ingredients 
                    : [],
                // Add metadata fields
                rating: cocktail.rating || 0,
                ratingCount: cocktail.ratingCount || 0,
                difficulty: cocktail.difficulty || 3,
                prepTime: cocktail.prepTime || 5,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            
            batch.set(docRef, processedCocktail);
            batchCount++;
            await commitBatchIfNeeded();
        }

        // Commit any remaining items
        if (batchCount > 0) {
            await batch.commit();
            console.log(`Committed final batch of ${batchCount} items`);
        }

        console.log('✅ Data import completed successfully!');
        console.log(`Imported:`);
        console.log(`  - ${categoriesData.length} categories`);
        console.log(`  - ${ingredientsData.length} ingredients`);
        console.log(`  - ${glassesData.length} glasses`);
        console.log(`  - ${cocktailsData.length} cocktails`);

    } catch (error) {
        console.error('❌ Error importing data:', error);
        if (error.code === 'ENOENT') {
            console.error('Data files not found. Make sure the data directory exists at the project root.');
            console.error('Expected files:');
            console.error('  - cocktail-buddy-api/data/cocktails.json');
            console.error('  - cocktail-buddy-api/data/ingrdients.json');
            console.error('  - cocktail-buddy-api/data/categories.json');
            console.error('  - cocktail-buddy-api/data/glasses.json');
        }
        process.exit(1);
    }
    
    process.exit(0);
};

// Run the import
importCocktailData(); 