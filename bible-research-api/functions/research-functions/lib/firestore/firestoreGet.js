import { db } from './firestore.js';

export const getDoc = async (collection, docId) => {
    try {
        const doc = await db.collection(collection).doc(docId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting document:', error);
        throw error;
    }
};

export const getDocs = async (collection, query = null) => {
    try {
        let collectionRef = db.collection(collection);
        
        if (query) {
            collectionRef = query(collectionRef);
        }
        
        const snapshot = await collectionRef.get();
        const docs = [];
        
        snapshot.forEach(doc => {
            docs.push({ id: doc.id, ...doc.data() });
        });
        
        return docs;
    } catch (error) {
        console.error('Error getting documents:', error);
        throw error;
    }
};

export const getDocsByField = async (collection, field, value) => {
    return getDocs(collection, (ref) => ref.where(field, '==', value));
};
