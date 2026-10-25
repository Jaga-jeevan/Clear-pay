import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''

  const userLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/transfer', label: 'Transfer' },
    { path: '/beneficiaries', label: 'Beneficiaries' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/alerts', label: 'Alerts' },
    { path: '/profile', label: 'Profile' },
  ]

  const adminLinks = [
    { path: '/admin', label: 'Admin Dashboard' },
  ]

  const links = user?.role === 'admin' ? adminLinks : userLinks

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-text">ClearPay</span>
        </Link>

        <ul className="navbar-menu">
          {links.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className={`nav-link ${isActive(link.path)}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-user">
          <span className="user-name">{user?.name || 'User'}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}