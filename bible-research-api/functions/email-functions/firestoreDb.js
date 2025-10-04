import { addDocNoId } from "./lib/firestore/firestoreSave.js";

export const createEmailOutboundDoc = async (data) => {
    return addDocNoId('outboundEmail', data);
}; 