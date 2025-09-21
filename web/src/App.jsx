import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import LoginPage from './components/LoginPage'
import MainPage from './components/MainPage'
import { auth, firebaseConfigError, isFirebaseConfigured } from './firebase'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setInitializing(false)
    })

    return unsubscribe
  }, [])

  if (firebaseConfigError) {
    return (
      <div className="loading-screen">
        <span className="loading-copy">
          {firebaseConfigError}. Update your environment variables in <code>
            .env
          </code>{' '}
          to enable authentication.
        </span>
      </div>
    )
  }

  if (initializing) {
    return (
      <div className="loading-screen">
        <div className="spinner" aria-hidden="true" />
        <span className="loading-copy">Preparing your experience…</span>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <MainPage user={user} onSignOut={() => signOut(auth)} />
}

export default App
