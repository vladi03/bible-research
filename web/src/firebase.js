import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missingKeys.length > 0 && import.meta.env.DEV) {
  console.warn(
    `Firebase configuration is missing values for: ${missingKeys.join(', ')}. ` +
      'Update your .env file with the VITE_FIREBASE_* settings.',
  )
}

let app
let auth

if (missingKeys.length === 0) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
}

export { auth }
export const isFirebaseConfigured = missingKeys.length === 0
