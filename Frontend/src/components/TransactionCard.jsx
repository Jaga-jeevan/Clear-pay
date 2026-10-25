import React from 'react'
import './TransactionCard.css'

export default function TransactionCard({ transaction }) {
  const { id, type, amount, description, recipient, beneficiary, date, time, status, fraudScore } = transaction

  const getStatusClass = () => {
    if (status === 'completed') return 'status-success'
    if (status === 'pending') return 'status-warning'
    if (status === 'flagged') return 'status-danger'
    return ''
  }

  const recipientInfo = recipient || beneficiary

  return (
    <div className="transaction-card">
      <div className="transaction-details">
        <div className="transaction-header">
          <div>
            <h4>{description}</h4>
            {recipientInfo && (
              <span className="transaction-recipient">To: {recipientInfo}</span>
            )}
          </div>
          <span className={`transaction-amount ${type}`}>
            {type === 'credit' ? '+' : '-'}₹{Number(amount).toFixed(2)}
          </span>
        </div>
        
        <div className="transaction-meta">
          {id && (
            <>
              <span className="transaction-id">{id}</span>
              <span className="meta-separator">•</span>
            </>
          )}
          <span className="transaction-date">{date}{time ? ` ${time}` : ''}</span>
          <span className="meta-separator">•</span>
          <span className={`transaction-status ${getStatusClass()}`}>
            {status}
          </span>
          {fraudScore !== undefined && (
            <>
              <span className="meta-separator">•</span>
              <span className="transaction-fraud">
                <span className="fraud-label">Risk:</span>
                <span className={`fraud-score ${fraudScore > 0.7 ? 'high' : fraudScore > 0.4 ? 'medium' : 'low'}`}>
                  {(fraudScore * 100).toFixed(1)}%
                </span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}