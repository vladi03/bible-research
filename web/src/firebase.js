import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const rawFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredKeys = ['apiKey', 'authDomain']
const missingRequiredKeys = requiredKeys.filter((key) => !rawFirebaseConfig[key])

const firebaseConfig = Object.fromEntries(
  Object.entries(rawFirebaseConfig).filter(([, value]) => Boolean(value)),
)

if (missingRequiredKeys.length > 0 && import.meta.env.DEV) {
  console.warn(
    `Firebase configuration is missing values for: ${missingRequiredKeys.join(', ')}. ` +
      'Update your .env file with the VITE_FIREBASE_* settings.',
  )
}

let app
let auth

if (missingRequiredKeys.length === 0) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
}

export { auth }
export const firebaseConfigError =
  missingRequiredKeys.length === 0
    ? null
    : `Firebase configuration is missing values for: ${missingRequiredKeys.join(', ')}`
export const isFirebaseConfigured = missingRequiredKeys.length === 0
