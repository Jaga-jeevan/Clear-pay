import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001'
  })
  const [editing, setEditing] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setEditing(false)
      alert('Profile updated successfully!')
    }, 1000)
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar card">
          <div className="profile-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h2>{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <strong>Account Status</strong>
              <span className="status-badge active">● Active</span>
            </div>
            <div className="stat-item">
              <strong>Member Since</strong>
              <span>January 2024</span>
            </div>
            <div className="stat-item">
              <strong>Account Type</strong>
              <span>{user?.role === 'admin' ? 'Admin' : 'Standard'}</span>
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="card">
            <div className="card-header">
              <h2>Personal Information</h2>
              {!editing && (
                <button className="btn btn-outline" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div className="input-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!editing}
                />
              </div>

              {editing && (
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="card">
            <h2>Security Settings</h2>
            <div className="security-options">
              <div className="security-item">
                <div>
                  <h3>Change Password</h3>
                  <p>Update your password regularly for better security</p>
                </div>
                <button className="btn btn-outline">Change</button>
              </div>
              <div className="security-item">
                <div>
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className="btn btn-outline">Enable</button>
              </div>
              <div className="security-item">
                <div>
                  <h3>Login History</h3>
                  <p>View recent login activity and devices</p>
                </div>
                <button className="btn btn-outline">View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}