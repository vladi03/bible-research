import { addDocNoId } from "./lib/firestore/firestoreSave.js";

// Research-specific Firestore operations
export const createResearchDoc = async (data) => {
    return addDocNoId('research', data);
};

export const createResearchNoteDoc = async (data) => {
    return addDocNoId('researchNotes', data);
};

export const createResearchTopicDoc = async (data) => {
    return addDocNoId('researchTopics', data);
};
