import { addDocNoId, updateDoc, getDoc } from "./lib/firestore/firestoreSave.js";

export const createNotificationDoc = async (data) => {
    return addDocNoId('notifications', data);
};

export const updateNotificationStatus = async (docId, status, deliveredAt = null) => {
    const updateData = { status };
    if (deliveredAt) {
        updateData.deliveredAt = deliveredAt;
    }
    return updateDoc('notifications', docId, updateData);
};

export const getNotification = async (docId) => {
    return getDoc('notifications', docId);
}; 