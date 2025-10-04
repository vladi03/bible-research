import {cors, isFirebaseAuth} from "./lib/utils/routeUtils.js";
import {onRequest} from "firebase-functions/https";
import {placeholderService} from "./services/placeholderVerse.js";

export const test = onRequest({timeoutSeconds: 540},
    async (request, response) => {
    await cors(request, response, async () => {
        const { data } = request.body;
        try {

            response.send({ message: 'Hello' });
        } catch (error) {
            console.error('Error sending email:', error);
            response.status(500).send({ error: 'Failed to send email' });
        }
    });
});
export const verse = onRequest({timeoutSeconds: 540},
    async (request, response) => {
        await cors(request, response, async () => {
            const { book, pageNumber } = request.body;
            try {
                const serviceData = await placeholderService(pageNumber);
                response.send({
                    verses: serviceData.verses,
                    sectionCommentaries: serviceData.sectionCommentaries,
                    pageNumber: pageNumber,
                    pageCount:10,
                    book: book
                });
            } catch (error) {
                console.error('Error sending email:', error);
                response.status(500).send({ error: 'Failed to send email' });
            }
        });
    });


export default { test ,verse};
