import PropTypes from 'prop-types'
import './MainPage.css'

export default function MainPage({ user, onSignOut }) {
  return (
    <div className="main-layout">
      <header className="main-banner">
        <div className="main-banner__titles">
          <h1>Bible Research</h1>
          <p>Research workspace</p>
        </div>
        <div className="main-banner__actions">
          <span className="main-banner__user" title={user.email ?? undefined}>
            {user.displayName || user.email}
          </span>
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>
      <section className="main-content" aria-label="Workspace" />
    </div>
  )
}

MainPage.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  onSignOut: PropTypes.func.isRequired,
}
