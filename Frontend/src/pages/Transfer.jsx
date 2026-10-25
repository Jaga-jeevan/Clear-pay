import React, { useState, useEffect } from 'react'
import FraudScoreDisplay from '../components/FraudScoreDisplay'
import { bankingStore } from '../services/bankingStore'
import './Transfer.css'

export default function Transfer() {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [formData, setFormData] = useState({
    beneficiary: '',
    amount: '',
    description: ''
  })
  const [fraudScore, setFraudScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lastTransfer, setLastTransfer] = useState(null)

  useEffect(() => {
    // Load beneficiaries from banking store
    setBeneficiaries(bankingStore.getBeneficiaries())
  }, [])

  const calculateFraudScore = (amount) => {
    // Simulate AI fraud detection
    let score = 0.05
    if (amount > 5000) score = 0.85
    else if (amount > 1000) score = 0.45
    else if (amount > 500) score = 0.25
    return score
  }

  const handleAmountChange = (value) => {
    setFormData({ ...formData, amount: value })
    if (value) {
      const score = calculateFraudScore(parseFloat(value))
      setFraudScore(score)
    } else {
      setFraudScore(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const numAmount = parseFloat(formData.amount)
    if (!numAmount || numAmount <= 0) {
      setLoading(false)
      return
    }

    const currentBalance = bankingStore.getBalance()
    if (numAmount > currentBalance) {
      alert(`Insufficient balance! Your current balance is ₹${currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`)
      setLoading(false)
      return
    }

    // Find selected beneficiary details
    const selectedBen = beneficiaries.find(b => b.id.toString() === formData.beneficiary.toString())
    const recipientText = selectedBen ? `${selectedBen.name} (${selectedBen.account})` : 'Beneficiary'

    const score = fraudScore !== null ? fraudScore : calculateFraudScore(numAmount)
    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000)
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const isHighRisk = score >= 0.7

    // Register transaction
    const newTxn = {
      id: txnId,
      type: 'debit',
      amount: numAmount,
      description: formData.description?.trim() || `Transfer to ${selectedBen?.name || 'Beneficiary'}`,
      recipient: recipientText,
      beneficiary: recipientText,
      date: dateStr,
      time: timeStr,
      status: isHighRisk ? 'flagged' : 'completed',
      fraudScore: score
    }

    // Deduct balance and record transaction in shared store
    bankingStore.deductBalance(numAmount)
    bankingStore.addTransaction(newTxn)

    // Register alert in shared store for Alerts page
    const alertObj = {
      id: 'ALT-' + Date.now(),
      type: isHighRisk ? 'high' : score >= 0.4 ? 'medium' : 'low',
      title: isHighRisk ? 'High-Risk Transfer Flagged' : 'Money Transfer Processed',
      message: isHighRisk
        ? `A transfer of ₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} to ${recipientText} was flagged by the AI fraud detection system (Risk Score: ${(score * 100).toFixed(1)}%). Ref: ${txnId}`
        : `A transfer of ₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} to ${recipientText} was successfully completed. Ref: ${txnId}`,
      timestamp: `${dateStr} ${timeStr}`,
      read: false
    }
    bankingStore.addAlert(alertObj)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    setLastTransfer({
      id: txnId,
      amount: numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
      recipient: recipientText,
      status: isHighRisk ? 'Flagged for Security Review' : 'Completed',
      fraudScore: score,
      isFlagged: isHighRisk
    })

    setSuccess(true)
    setLoading(false)

    // Reset inputs
    setFormData({ beneficiary: '', amount: '', description: '' })
    setFraudScore(null)
  }

  return (
    <div className="transfer-page">
      <div className="page-header">
        <h1>Transfer Money</h1>
        <p>Send money securely with AI fraud detection</p>
      </div>

      <div className="transfer-container">
        <div className="transfer-form-section">
          {success && lastTransfer && (
            <div className={`alert ${lastTransfer.isFlagged ? 'alert-warning' : 'alert-success'}`}>
              <div>
                <strong>
                  {lastTransfer.isFlagged ? 'Transfer Flagged by AI Fraud Detection' : 'Transfer Completed Successfully!'}
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                  ₹{lastTransfer.amount} transferred to {lastTransfer.recipient}.
                  {' '}Ref ID: <code>{lastTransfer.id}</code> • Status: <strong>{lastTransfer.status}</strong> (AI Risk Score: {(lastTransfer.fraudScore * 100).toFixed(1)}%).
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="transfer-form card">
            <h2>Transfer Details</h2>

            <div className="input-group">
              <label>Select Beneficiary</label>
              <select
                value={formData.beneficiary}
                onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
                required
              >
                <option value="">Choose a beneficiary</option>
                {beneficiaries.map(ben => (
                  <option key={ben.id} value={ben.id}>
                    {ben.name} - {ben.account}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="input-group">
              <label>Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What's this transfer for?"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading || !formData.beneficiary || !formData.amount}
            >
              {loading ? 'Processing...' : 'Transfer Money'}
            </button>
          </form>

          <div className="transfer-info card">
            <h3>Transfer Information</h3>
            <div className="info-item">
              <span>Processing Time</span>
              <strong>Instant</strong>
            </div>
            <div className="info-item">
              <span>Transaction Fee</span>
              <strong>₹0.00</strong>
            </div>
            <div className="info-item">
              <span>Daily Limit</span>
              <strong>₹10,000</strong>
            </div>
          </div>
        </div>

        <div className="fraud-detection-section">
          <div className="card">
            <h2>AI Fraud Detection</h2>
            {fraudScore !== null ? (
              <FraudScoreDisplay score={fraudScore} size="large" />
            ) : (
              <div className="no-analysis">
                <p>Enter an amount to analyze fraud risk</p>
              </div>
            )}
          </div>

          <div className="card security-features">
            <h3>Security Features</h3>
            <ul className="features-list">
              <li>
                <span>✓</span>
                <span>Real-time AI analysis</span>
              </li>
              <li>
                <span>✓</span>
                <span>256-bit encryption</span>
              </li>
              <li>
                <span>✓</span>
                <span>Two-factor authentication</span>
              </li>
              <li>
                <span>✓</span>
                <span>Instant fraud alerts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}