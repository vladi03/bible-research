import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const rawFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
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
let googleProvider

if (missingRequiredKeys.length === 0) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
  googleProvider.setCustomParameters({ prompt: 'select_account' })
}

export { auth }

export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase is not configured for authentication.')
  }

  return signInWithPopup(auth, googleProvider)
}

export const firebaseConfigError =
  missingRequiredKeys.length === 0
    ? null
    : `Firebase configuration is missing values for: ${missingRequiredKeys.join(', ')}`
export const isFirebaseConfigured = missingRequiredKeys.length === 0
