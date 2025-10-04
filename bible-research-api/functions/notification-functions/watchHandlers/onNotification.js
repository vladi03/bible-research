import {addNotificationCustomMessage} from "../lib/firestore/firestoreSave.js";
import { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } from 'firebase-functions/v2/firestore';
const collectionName = 'notifications'

const onCreateFirestoreDocument =
    onDocumentCreated(`${collectionName}/{docId}`, async (event) => {
        const { data, params } = event;
        const newNotification = data.data();

        // Log the notification data
        console.log(`New notification created with ID: ${params.docId}`, newNotification);

        // Check if the deliveryMethod includes 'push'
        if (newNotification.deliveryMethod && newNotification.deliveryMethod.includes('push')) {
            // Extract necessary fields
            const { title, message, receiverId } = newNotification;

            // Default to 'home' if initial_page_name is not specified
            const initial_page_name = newNotification.initial_page_name || 'ClientDashboard';

            // Send custom notification message
            try {
                const result = await addNotificationCustomMessage(receiverId, message, title, initial_page_name,
                    newNotification.parameter_data, newNotification.photo, newNotification.scheduled_time);
                console.log("Notification sent successfully:", result.id);
            } catch (error) {
                console.error("Failed to send notification:", error);
            }
        } else {
            console.log('No push delivery method specified.');
        }
    });
export default {
    onCreateFirestoreDocument,

};