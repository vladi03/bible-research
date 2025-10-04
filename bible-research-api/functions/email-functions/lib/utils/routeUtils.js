import { getAuth } from "firebase-admin/auth";
import { GoogleAuth } from "google-auth-library";
import functions from "firebase-functions";

export const isFirebaseAuth = async (request, response, next) => {
    const parts = request.headers?.authorization?.split(" ");

    if (parts?.length === 2) {
        try {
            const userInfo = await getAuth()
                .verifyIdToken(parts[1]);

            if (!userInfo?.uid) {
                response.status(401).send({ message: 'Authentication Required!' });
            } else {
                request.auth = userInfo;
                next();
            }
        } catch (ex) {
            response.status(401).send({ message: ex.message });
        }
    } else {
        response.status(401).send({ message: 'Authentication Required!' });
    }
};

export const cors = async (request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Credentials', 'true');
    if (request.method === 'OPTIONS') {
        response.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        response.set('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        response.set('Access-Control-Max-Age', '3600');
        response.status(204).send('');
    } else {
        await next(request, response);
    }
};

let auth;
export async function getFunctionUrl(name, location = "us-central1") {
    if (!auth) {
        auth = new GoogleAuth({
            scopes: "https://www.googleapis.com/auth/cloud-platform",
        });
    }
    const projectId = await auth.getProjectId();
    const url = "https://cloudfunctions.googleapis.com/v2beta/" +
        `projects/${projectId}/locations/${location}/functions/${name}`;

    const client = await auth.getClient();
    const res = await client.request({ url });
    const uri = res.data?.serviceConfig?.uri;
    if (!uri) {
        throw new Error(`Unable to retrieve uri for function at ${url}`);
    }
    return uri;
}

export const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '256MB'
}; 