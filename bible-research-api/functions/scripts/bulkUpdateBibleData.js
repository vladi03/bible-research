import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

const bulkUpdateCocktails = async () => {
    console.log('Starting bulk update of cocktails...');
    
    try {
        const cocktailsRef = db.collection('cocktails');
        const snapshot = await cocktailsRef.get();
        
        console.log(`Found ${snapshot.size} cocktails to potentially update`);
        
        const batch = db.batch();
        let updatedCount = 0;
        let batchCount = 0;
        const maxBatchSize = 500;

        snapshot.forEach((doc) => {
            const cocktail = doc.data();
            let needsUpdate = false;
            const updates = {};

            // Add missing fields
            if (!cocktail.rating) {
                updates.rating = 0;
                needsUpdate = true;
            }

            if (!cocktail.ratingCount) {
                updates.ratingCount = 0;
                needsUpdate = true;
            }

            if (!cocktail.difficulty) {
                updates.difficulty = 3; // Default medium difficulty
                needsUpdate = true;
            }

            if (!cocktail.prepTime) {
                updates.prepTime = 5; // Default 5 minutes
                needsUpdate = true;
            }

            // Ensure ingredients is properly formatted
            if (!Array.isArray(cocktail.ingredients)) {
                updates.ingredients = [];
                needsUpdate = true;
            }

            // Add tags based on cocktail properties
            if (!cocktail.tags || !Array.isArray(cocktail.tags)) {
                const tags = [];
                
                // Add difficulty-based tags
                if (cocktail.difficulty <= 2) tags.push('easy');
                else if (cocktail.difficulty >= 4) tags.push('advanced');
                
                // Add category-based tags
                if (cocktail.category) {
                    tags.push(cocktail.category.toLowerCase().replace(/\s+/g, '_'));
                }
                
                // Add spirit-based tags
                if (cocktail.ingredients) {
                    cocktail.ingredients.forEach(ingredient => {
                        if (ingredient.name) {
                            const name = ingredient.name.toLowerCase();
                            if (name.includes('vodka')) tags.push('vodka');
                            else if (name.includes('gin')) tags.push('gin');
                            else if (name.includes('rum')) tags.push('rum');
                            else if (name.includes('whiskey') || name.includes('bourbon')) tags.push('whiskey');
                            else if (name.includes('tequila')) tags.push('tequila');
                        }
                    });
                }
                
                updates.tags = [...new Set(tags)]; // Remove duplicates
                needsUpdate = true;
            }

            // Update the updatedAt timestamp
            if (needsUpdate) {
                updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
                
                batch.update(doc.ref, updates);
                updatedCount++;
                batchCount++;

                if (batchCount >= maxBatchSize) {
                    // We need to commit this batch and start a new one
                    console.log(`Committing batch of ${batchCount} updates...`);
                    batchCount = 0;
                }
            }
        });

        // Commit the final batch
        if (batchCount > 0) {
            await batch.commit();
            console.log(`Committed final batch of ${batchCount} updates`);
        }

        console.log(`✅ Bulk update completed! Updated ${updatedCount} cocktails`);

        // Update cocktail statistics
        await updateCocktailStats();

    } catch (error) {
        console.error('❌ Error during bulk update:', error);
        process.exit(1);
    }
    
    process.exit(0);
};

const updateCocktailStats = async () => {
    console.log('Updating cocktail statistics...');
    
    try {
        const cocktailsRef = db.collection('cocktails');
        const snapshot = await cocktailsRef.get();
        
        const stats = {
            totalCocktails: snapshot.size,
            categoryCounts: {},
            difficultyDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            averageRating: 0,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        let totalRating = 0;
        let ratedCocktails = 0;

        snapshot.forEach((doc) => {
            const cocktail = doc.data();
            
            // Count categories
            if (cocktail.category) {
                stats.categoryCounts[cocktail.category] = 
                    (stats.categoryCounts[cocktail.category] || 0) + 1;
            }
            
            // Count difficulty distribution
            if (cocktail.difficulty) {
                stats.difficultyDistribution[cocktail.difficulty]++;
            }
            
            // Calculate average rating
            if (cocktail.rating && cocktail.rating > 0) {
                totalRating += cocktail.rating;
                ratedCocktails++;
            }
        });

        if (ratedCocktails > 0) {
            stats.averageRating = totalRating / ratedCocktails;
        }

        // Save stats to Firestore
        await db.collection('appStats').doc('cocktails').set(stats);
        
        console.log('📊 Statistics updated:');
        console.log(`Total cocktails: ${stats.totalCocktails}`);
        console.log(`Categories: ${Object.keys(stats.categoryCounts).length}`);
        console.log(`Average rating: ${stats.averageRating.toFixed(2)}`);
        
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
};

// Run the bulk update
bulkUpdateCocktails(); 