import firestore, { db } from './firestore.js';
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


export const uploadFireStoreMergeByRef = async (ref, data)=> {
    await ref.set({...data}, {merge: true});
    return true;
}

export const uploadFirestoreAndMerge = async (collection,id,data)=>{
    const db = firestore;
    const docRef = db.collection(collection).doc(id);
    return await docRef.set(data, { merge: true });
}

const addNotification = async (userId, message,title, initial_page_name) => {
    const res = await db.collection("ff_push_notifications")
        .add({
            "initial_page_name": initial_page_name,
            "notification_text": message,
            "notification_title": title,
            "user_refs": `/Users/${userId}`,
            "created_time": FieldValue.serverTimestamp(),
        });
    return res;
}

export const addNotificationCustomMessage = async (userId, message, title, initial_page_name, parameter_data = {}, photo = null,scheduled_time=null) => {
    const db = firestore;
    let addExtra = {}
    if (photo) {
        addExtra = {
            notification_image_url: photo
        }

    }
    if(scheduled_time){
        addExtra = {scheduled_time}
    }
    const res = await db.collection("ff_push_notifications")
        .add({
            "initial_page_name": initial_page_name,
            "notification_text": message,
            "notification_title": title,
            "user_refs": `/users/${userId}`,
            "created_time": FieldValue.serverTimestamp(),
            parameter_data: JSON.stringify(parameter_data),
            ...addExtra
        });
    return res;
}
export const createNotificationDocument = async ({
                                                     userId, message, title,
                                                     deliveryMethod, initialPageName = 'ClientDashboard',
                                                     parameter_data = {},
                                                     imageUrl
                                                 }) => {
    const db = firestore;
    let addExtra = {}
    if (imageUrl) {
        addExtra = {photo: imageUrl}
    }

    const res = await db.
    collection("notifications").add({
        "isRead": false,
        "isDismissed": false,
        "message": message,
        "receiverRef": await getRef('Users', userId),
        "receiverId": userId,
        deliveryMethod,
        "title": title,
        "createdTime": FieldValue.serverTimestamp(),
        "parameter_data": parameter_data,
        "initial_page_name": initialPageName,
        target_audience: "All",
        ...addExtra
    });

    return res;
}