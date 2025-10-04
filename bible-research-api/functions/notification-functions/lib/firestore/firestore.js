import admin from "firebase-admin";
import { createRequire } from "module";
import {getFirestore} from "firebase-admin/firestore";
export const importFile = createRequire(import.meta.url);

// Initialize Firebase Admin SDK if not already initialized
const  initAdmin = () => {
    try {
        if (process.env.ENVIRONMENT === 'Local') {
            const serviceAccount = importFile("./SA.json");

            console.log("Firebase admin initialization locally")
            return  admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });//gs://ckr-app-88.appspot.com

        } else {
            return admin.initializeApp();
        }
    } catch (error) {
        console.error("Firebase admin initialization error:", error);
        throw error;  // Rethrow the error after logging it
    }

}

if (!admin.apps.length) {  // Check if already initialized
    initAdmin();
}


const db = admin.firestore();
export const firestore = getFirestore();
/* End firestore admin */

export { db };
export default db; 