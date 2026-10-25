import React, { useState, useEffect } from 'react'
import { bankingStore } from '../services/bankingStore'
import './Alerts.css'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Load alerts from banking store
    setAlerts(bankingStore.getAlerts())
  }, [])

  const markAsRead = (id) => {
    const updated = bankingStore.markAlertAsRead(id)
    setAlerts(updated)
  }

  const markAllAsRead = () => {
    const updated = bankingStore.markAllAlertsAsRead()
    setAlerts(updated)
  }

  const getAlertClass = (type) => {
    switch (type) {
      case 'high': return 'alert-high'
      case 'medium': return 'alert-medium'
      case 'low': return 'alert-low'
      default: return 'alert-info'
    }
  }

  const getSeverityLabel = (type) => {
    switch (type) {
      case 'high': return 'High Risk'
      case 'medium': return 'Notice'
      case 'low': return 'Info'
      default: return 'General'
    }
  }

  const unreadCount = alerts.filter(a => !a.read).length

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div className="header-text">
          <h1>Alerts & Notifications</h1>
          <p>Security alerts and important notifications</p>
        </div>
        <div className="header-badges">
          {unreadCount > 0 ? (
            <>
              <span className="unread-badge">{unreadCount} Unread</span>
              <button
                type="button"
                className="btn-mark-all"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            </>
          ) : (
            <span className="all-read-badge">All caught up</span>
          )}
        </div>
      </div>

      <div className="alerts-container">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`alert-card ${getAlertClass(alert.type)} ${alert.read ? 'read' : 'unread'}`}
            >
              <div className="alert-header">
                <div className="alert-title-wrap">
                  <h3>{alert.title}</h3>
                  <span className={`severity-tag severity-${alert.type || 'low'}`}>
                    {getSeverityLabel(alert.type)}
                  </span>
                  {!alert.read && <span className="new-badge">NEW</span>}
                </div>
              </div>

              <p className="alert-message">{alert.message}</p>

              <div className="alert-footer">
                <span className="alert-time">{alert.timestamp}</span>
                {!alert.read ? (
                  <button
                    type="button"
                    className="btn-mark-read"
                    onClick={() => markAsRead(alert.id)}
                  >
                    Mark as Read
                  </button>
                ) : (
                  <span className="read-status">Read</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-alerts">
            <p>No alerts at this time.</p>
          </div>
        )}
      </div>
    </div>
  )
}