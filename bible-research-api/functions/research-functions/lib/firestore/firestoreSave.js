import { db } from './firestore.js';
import { FieldValue } from 'firebase-admin/firestore';

export const addDocNoId = async (collection, data) => {
    try {
        const timestamp = FieldValue.serverTimestamp();
        const docData = {
            ...data,
            createdAt: timestamp,
            updatedAt: timestamp
        };
        
        const docRef = await db.collection(collection).add(docData);
        return docRef.id;
    } catch (error) {
        console.error('Error adding document:', error);
        throw error;
    }
};

export const addDocWithId = async (collection, docId, data) => {
    try {
        const timestamp = FieldValue.serverTimestamp();
        const docData = {
            ...data,
            createdAt: timestamp,
            updatedAt: timestamp
        };
        
        await db.collection(collection).doc(docId).set(docData);
        return docId;
    } catch (error) {
        console.error('Error adding document with ID:', error);
        throw error;
    }
};

export const updateDoc = async (collection, docId, data) => {
    try {
        const timestamp = FieldValue.serverTimestamp();
        const updateData = {
            ...data,
            updatedAt: timestamp
        };
        
        await db.collection(collection).doc(docId).update(updateData);
        return docId;
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
};

export const deleteDoc = async (collection, docId) => {
    try {
        await db.collection(collection).doc(docId).delete();
        return docId;
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
};
