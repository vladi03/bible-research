import emailRoute from "./emailRoute.js";
import { onCreateOutgoingEmail } from "./watchHandlers/onCreateOutgoingEmail.js";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

export const email = emailRoute;

export const onCreateEmailTrigger = onDocumentCreated('outboundEmail/{docId}', async (event) => {
    const { data, params } = event;
    await onCreateOutgoingEmail(data, params);
}); 