import React from 'react'
import './FraudScoreDisplay.css'

export default function FraudScoreDisplay({ score, size = 'medium' }) {
  const getScoreLevel = () => {
    if (score >= 0.7) return { level: 'high', color: '#ef4444', label: 'High Risk' }
    if (score >= 0.4) return { level: 'medium', color: '#f59e0b', label: 'Medium Risk' }
    return { level: 'low', color: '#10b981', label: 'Low Risk' }
  }

  const { level, color, label } = getScoreLevel()
  const percentage = (score * 100).toFixed(1)

  return (
    <div className={`fraud-score-display ${size}`}>
      <div className="score-circle" style={{ borderColor: color }}>
        <svg className="score-ring" viewBox="0 0 100 100">
          <circle
            className="score-ring-background"
            cx="50"
            cy="50"
            r="45"
          />
          <circle
            className="score-ring-progress"
            cx="50"
            cy="50"
            r="45"
            style={{
              stroke: color,
              strokeDashoffset: 283 - (283 * score)
            }}
          />
        </svg>
        <div className="score-content">
          <span className="score-value">{percentage}%</span>
        </div>
      </div>
      <div className="score-info">
        <span className={`score-label ${level}`}>{label}</span>
        <p className="score-description">
          {level === 'high' && 'Transaction flagged for review'}
          {level === 'medium' && 'Proceed with caution'}
          {level === 'low' && 'Transaction appears safe'}
        </p>
      </div>
    </div>
  )
}