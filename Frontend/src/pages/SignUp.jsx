import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import './Login.css'

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    const { fullName, email, password, confirmPassword, agreeTerms } = formData

    if (!fullName.trim()) {
      return 'Full name is required'
    }
    if (fullName.trim().length < 3 || fullName.trim().length > 50) {
      return 'Full name must be between 3 and 50 characters'
    }

    if (!email.trim()) {
      return 'Email address is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address'
    }

    if (!password) {
      return 'Password is required'
    }
    if (password.length < 8 || password.length > 128) {
      return 'Password must be between 8 and 128 characters'
    }

    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[@$!%*?&#^()_+=\-[\]{}|;:'",.<>\/`~]/.test(password)

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      return 'Password must contain uppercase, lowercase, number, and special character'
    }

    if (!confirmPassword) {
      return 'Please confirm your password'
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }

    if (!agreeTerms) {
      return 'You must accept the Terms and Conditions and Privacy Policy'
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      })

      if (response.data && (response.data.success || response.data.accessToken || response.data.token)) {
        setSuccess('Account created successfully! Redirecting...')
        const u = response.data.user || {}
        const token = response.data.accessToken || response.data.token || ('jwt-token-' + Date.now())
        const userData = {
          id: u.id || u._id || 1,
          name: u.fullName || formData.fullName.trim(),
          email: u.email || formData.email.trim().toLowerCase(),
          role: u.role || 'customer'
        }

        login(userData, token)
        setTimeout(() => {
          navigate('/dashboard')
        }, 1200)
      } else {
        setError(response.data?.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      console.error('Registration error:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.data?.errors?.[0]?.message) {
        setError(err.response.data.errors[0].message)
      } else if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Network error. Unable to register. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <h1>ClearPay</h1>
            <p>AI-Powered Banking Fraud Detection</p>
          </div>
          
          <div className="login-features">
            <div className="login-feature">
              <span>✓</span>
              <p>Real-time fraud detection</p>
            </div>
            <div className="login-feature">
              <span>✓</span>
              <p>Secure transactions</p>
            </div>
            <div className="login-feature">
              <span>✓</span>
              <p>24/7 monitoring</p>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <h2>Create Account</h2>
            <p className="login-subtitle">Create your ClearPay account.</p>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>I agree to the Terms and Conditions and Privacy Policy</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
