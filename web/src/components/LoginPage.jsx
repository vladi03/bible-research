import { useState } from 'react'
import { signInWithGoogle } from '../firebase'
import './LoginPage.css'

const authErrorMessages = {
  'auth/popup-blocked': 'Your browser blocked the sign-in popup. Allow popups and try again.',
  'auth/popup-closed-by-user': 'The popup closed before you finished signing in. Please try again.',
  'auth/cancelled-popup-request': 'Another sign-in request is already in progress. Please wait a moment and retry.',
  'auth/network-request-failed': 'We could not reach Google. Check your connection and try again.',
}

function formatAuthError(error) {
  if (!error) return ''
  if (error.code && authErrorMessages[error.code]) {
    return authErrorMessages[error.code]
  }

  if (typeof error.message === 'string') {
    return error.message.replace(/^Firebase: /, '')
  }

  return 'Something went wrong. Please try again.'
}

export default function LoginPage() {
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleGoogleSignIn = async () => {
    setSubmitting(true)
    setError('')

    try {
      await signInWithGoogle()
    } catch (err) {
      setError(formatAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-layout">
      <div className="login-card">
        <div className="login-card__header">
          <h1>Bible Research</h1>
          <p className="login-subheading">
            Continue your study workspace with your Google account.
          </p>
        </div>

        <div className="login-actions">
          <button
            className="login-google-button"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
          >
            {submitting ? 'Signing you in...' : 'Continue with Google'}
          </button>
          {error ? <p className="login-error">{error}</p> : null}
          <p className="login-hint">
            You'll be prompted to choose an account if you use more than one Google profile.
          </p>
        </div>
      </div>
      <div className="login-hero" aria-hidden="true">
        <div className="hero-glow" />
        <div className="hero-content">
          <h2>Study together.</h2>
          <p>
            Keep your notes, reading plans, and discoveries in sync wherever you go.
          </p>
        </div>
      </div>
    </div>
  )
}
