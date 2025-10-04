import { onRequest } from "firebase-functions/v2/https";
import { createEmailOutboundDoc } from "./firestoreDb.js";
import { isFirebaseAuth } from "./lib/utils/routeUtils.js";
import { testOutgoingEmail } from "./watchHandlers/onCreateOutgoingEmail.js";

export const test = onRequest({timeoutSeconds: 540}, async (request, response) => {
    await isFirebaseAuth(request, response, async () => {
        const { data } = request.body;

        try {
            await testOutgoingEmail({
                email: 'test@cocktailbuddy.com',
                templateType: 'cocktailRecommendation',
                templateData: data,
                subject: 'Your Personalized Cocktail Recommendations'
            });

            response.send({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            response.status(500).send({ error: 'Failed to send email' });
        }
    });
});

export const sendCocktailRecommendation = onRequest({timeoutSeconds: 300}, async (request, response) => {
    await isFirebaseAuth(request, response, async () => {
        const { email, cocktailData, userPreferences } = request.body;

        try {
            await createEmailOutboundDoc({
                email,
                templateType: 'cocktailRecommendation',
                templateData: {
                    cocktails: cocktailData,
                    preferences: userPreferences,
                    userName: request.auth.name || 'Fellow Cocktail Enthusiast'
                },
                subject: 'Your Personalized Cocktail Recommendations',
                userId: request.auth.uid
            });

            response.send({ message: 'Cocktail recommendation email queued' });
        } catch (error) {
            console.error('Error queuing cocktail email:', error);
            response.status(500).send({ error: 'Failed to queue email' });
        }
    });
});

export const sendWelcomeEmail = onRequest({timeoutSeconds: 300}, async (request, response) => {
    await isFirebaseAuth(request, response, async () => {
        const { email, userName } = request.body;

        try {
            await createEmailOutboundDoc({
                email,
                templateType: 'welcome',
                templateData: {
                    userName: userName || 'Cocktail Enthusiast'
                },
                subject: 'Welcome to Cocktail Buddy!',
                userId: request.auth.uid
            });

            response.send({ message: 'Welcome email queued' });
        } catch (error) {
            console.error('Error queuing welcome email:', error);
            response.status(500).send({ error: 'Failed to queue email' });
        }
    });
});

export default {
    test,
    sendCocktailRecommendation,
    sendWelcomeEmail
}; 