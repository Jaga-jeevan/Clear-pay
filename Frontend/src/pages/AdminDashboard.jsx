   
import React, { useState, useEffect } from 'react'
import FraudScoreDisplay from '../components/FraudScoreDisplay'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudDetected: 0,
    totalUsers: 0,
    activeAlerts: 0
  })
  const [liveTransactions, setLiveTransactions] = useState([])
  const [fraudLogs, setFraudLogs] = useState([])

  useEffect(() => {
    // Simulate fetching admin data
    setStats({
      totalTransactions: 15847,
      fraudDetected: 127,
      totalUsers: 3421,
      activeAlerts: 8
    })

    setLiveTransactions([
      { id: 1, user: 'John Doe', amount: 250, timestamp: '14:23:45', status: 'processing', fraudScore: 0.12 },
      { id: 2, user: 'Jane Smith', amount: 5000, timestamp: '14:22:31', status: 'flagged', fraudScore: 0.87 },
      { id: 3, user: 'Bob Johnson', amount: 75, timestamp: '14:21:18', status: 'completed', fraudScore: 0.05 },
      { id: 4, user: 'Alice Williams', amount: 1200, timestamp: '14:20:52', status: 'completed', fraudScore: 0.28 },
      { id: 5, user: 'Charlie Brown', amount: 450, timestamp: '14:19:33', status: 'processing', fraudScore: 0.15 }
    ])

    setFraudLogs([
      { id: 1, transactionId: 'TXN-9871', user: 'Jane Smith', amount: 5000, reason: 'Unusual transaction amount', timestamp: '14:22:31', severity: 'high' },
      { id: 2, transactionId: 'TXN-9845', user: 'Tom Wilson', amount: 3500, reason: 'Multiple transactions in short time', timestamp: '14:15:22', severity: 'medium' },
      { id: 3, transactionId: 'TXN-9823', user: 'Sarah Davis', amount: 8000, reason: 'New beneficiary with large amount', timestamp: '14:10:11', severity: 'high' },
      { id: 4, transactionId: 'TXN-9801', user: 'Mike Johnson', amount: 1500, reason: 'Transaction from unusual location', timestamp: '14:05:45', severity: 'medium' }
    ])

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newTransaction = {
        id: Date.now(),
        user: ['User A', 'User B', 'User C'][Math.floor(Math.random() * 3)],
        amount: Math.floor(Math.random() * 5000) + 50,
        timestamp: new Date().toLocaleTimeString(),
        status: ['processing', 'completed'][Math.floor(Math.random() * 2)],
        fraudScore: Math.random()
      }
      setLiveTransactions(prev => [newTransaction, ...prev.slice(0, 4)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="admin-dashboard-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Real-time monitoring and fraud detection</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Total Transactions</p>
            <h2 className="stat-value">{stats.totalTransactions.toLocaleString()}</h2>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">🚨</div>
          <div className="stat-info">
            <p className="stat-label">Fraud Detected</p>
            <h2 className="stat-value">{stats.fraudDetected}</h2>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <p className="stat-label">Total Users</p>
            <h2 className="stat-value">{stats.totalUsers.toLocaleString()}</h2>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <p className="stat-label">Active Alerts</p>
            <h2 className="stat-value">{stats.activeAlerts}</h2>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        {/* Live Transactions */}
        <div className="card live-transactions">
          <div className="card-header">
            <h2>Live Transactions</h2>
            <span className="live-indicator">● LIVE</span>
          </div>
          <div className="transactions-list">
            {liveTransactions.map(txn => (
              <div key={txn.id} className="transaction-row">
                <div className="transaction-user">
                  <strong>{txn.user}</strong>
                  <span>{txn.timestamp}</span>
                </div>
                <div className="transaction-amount">
                  ₹{txn.amount.toFixed(2)}
                </div>
                <div className={`transaction-status status-${txn.status}`}>
                  {txn.status}
                </div>
                <div className="transaction-fraud">
                  <span className={`fraud-indicator ${
                    txn.fraudScore > 0.7 ? 'high' : txn.fraudScore > 0.4 ? 'medium' : 'low'
                  }`}>
                    {(txn.fraudScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud Logs */}
        <div className="card fraud-logs">
          <h2>Recent Fraud Alerts</h2>
          <div className="fraud-list">
            {fraudLogs.map(log => (
              <div key={log.id} className={`fraud-log-item severity-${log.severity}`}>
                <div className="fraud-log-header">
                  <strong>{log.transactionId}</strong>
                  <span className={`severity-badge ${log.severity}`}>
                    {log.severity.toUpperCase()}
                  </span>
                </div>
                <p className="fraud-log-user">{log.user} - ₹{log.amount.toFixed(2)}</p>
                <p className="fraud-log-reason">{log.reason}</p>
                <span className="fraud-log-time">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}