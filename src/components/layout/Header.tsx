import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      style={{
        padding: '1rem var(--container-padding)',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--header-bg)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/">App</Link>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/dashboard">Dashboard</Link>
          <button type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  )
}
