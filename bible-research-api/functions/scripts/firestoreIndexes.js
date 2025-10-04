import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

const createIndexes = async () => {
    console.log('Creating Firestore indexes for Cocktail Buddy API...');
    
    try {
        // Note: Firestore indexes need to be created through the Firebase Console or CLI
        // This script serves as documentation for required indexes
        
        const requiredIndexes = [
            {
                collection: 'cocktails',
                fields: [
                    { field: 'category', order: 'ASCENDING' },
                    { field: 'name', order: 'ASCENDING' }
                ]
            },
            {
                collection: 'cocktails',
                fields: [
                    { field: 'difficulty', order: 'ASCENDING' },
                    { field: 'createdAt', order: 'DESCENDING' }
                ]
            },
            {
                collection: 'cocktails',
                fields: [
                    { field: 'ingredients.name', order: 'ASCENDING' },
                    { field: 'name', order: 'ASCENDING' }
                ]
            },
            {
                collection: 'userFavorites',
                fields: [
                    { field: 'userId', order: 'ASCENDING' },
                    { field: 'createdAt', order: 'DESCENDING' }
                ]
            },
            {
                collection: 'userPreferences',
                fields: [
                    { field: 'userId', order: 'ASCENDING' },
                    { field: 'updatedAt', order: 'DESCENDING' }
                ]
            },
            {
                collection: 'cocktailRatings',
                fields: [
                    { field: 'cocktailId', order: 'ASCENDING' },
                    { field: 'rating', order: 'DESCENDING' }
                ]
            },
            {
                collection: 'outboundEmail',
                fields: [
                    { field: 'status', order: 'ASCENDING' },
                    { field: 'createdAt', order: 'DESCENDING' }
                ]
            },
            {
                collection: 'notifications',
                fields: [
                    { field: 'userId', order: 'ASCENDING' },
                    { field: 'status', order: 'ASCENDING' },
                    { field: 'createdAt', order: 'DESCENDING' }
                ]
            }
        ];

        console.log('Required Firestore indexes:');
        console.log('==========================');
        
        requiredIndexes.forEach((index, i) => {
            console.log(`${i + 1}. Collection: ${index.collection}`);
            console.log(`   Fields: ${index.fields.map(f => `${f.field} (${f.order})`).join(', ')}`);
            console.log('');
        });

        console.log('To create these indexes, run:');
        console.log('firebase firestore:indexes');
        console.log('');
        console.log('Or create them manually in the Firebase Console:');
        console.log('https://console.firebase.google.com/project/{project-id}/firestore/indexes');

        // Test a simple query to verify basic setup
        const testQuery = await db.collection('cocktails').limit(1).get();
        console.log(`Database connection successful. Sample collection size: ${testQuery.size}`);
        
    } catch (error) {
        console.error('Error managing Firestore indexes:', error);
        process.exit(1);
    }
    
    process.exit(0);
};

createIndexes(); 