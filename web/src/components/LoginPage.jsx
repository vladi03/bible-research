import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase'
import './LoginPage.css'

const authErrorMessages = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with that email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/weak-password': 'Passwords should be at least 6 characters.',
  'auth/email-already-in-use': 'An account already exists with this email.',
}

function formatAuthError(error) {
  if (!error) return ''
  return authErrorMessages[error.code] ?? 'Something went wrong. Please try again.'
}

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email || !password) {
      setError('Please complete both fields to continue.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
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
            Sign in to continue your study across synced devices.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <p className="login-error">{error}</p> : null}

          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button className="login-switch" type="button" onClick={toggleMode}>
          {mode === 'login'
            ? "Don't have an account? Create one"
            : 'Already have an account? Sign in'}
        </button>
      </div>
      <div className="login-hero" aria-hidden="true">
        <div className="hero-glow" />
        <div className="hero-content">
          <h2>Study together.</h2>
          <p>
            Keep your notes, reading plans, and discoveries in sync wherever you
            go.
          </p>
        </div>
      </div>
    </div>
  )
}
