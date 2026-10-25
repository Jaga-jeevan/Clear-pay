import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import TransactionCard from '../components/TransactionCard'
import { bankingStore } from '../services/bankingStore'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load balance and recent transactions from banking store
    setBalance(bankingStore.getBalance())
    const allTxns = bankingStore.getTransactions()
    setRecentTransactions(allTxns.slice(0, 4))
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p>Here's your account overview</p>
        </div>
        <Link to="/transfer" className="btn btn-primary">
          Transfer Money
        </Link>
      </div>

      <div className="dashboard-grid">
        {/* Account Details */}
        <div className="account-card card">
          <div className="card-header-simple">
            <h3>Account Details</h3>
            <span className="status-badge">Active</span>
          </div>
          <div className="balance-block">
            <span className="balance-label">Available Balance</span>
            <div className="balance-amount">
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="account-info-list">
            <div className="info-row">
              <span className="info-label">Account Holder</span>
              <span className="info-value">{user?.name || 'John Doe'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Number</span>
              <span className="info-value">****1234</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions card">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/transfer" className="action-btn">
              Transfer
            </Link>
            <Link to="/beneficiaries" className="action-btn">
              Beneficiaries
            </Link>
            <Link to="/transactions" className="action-btn">
              History
            </Link>
            <Link to="/profile" className="action-btn">
              Settings
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="recent-transactions-section card">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <Link to="/transactions" className="view-all-link">
              View All
            </Link>
          </div>
          <div className="transactions-list">
            {recentTransactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>

        {/* Security Status */}
        <div className="security-status-section card">
          <h3>Security Status</h3>
          <p className="security-message">
            Your account is secure. No suspicious activity detected.
          </p>
          <div className="security-action">
            <Link to="/alerts" className="btn btn-outline btn-small">
              View Security Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}