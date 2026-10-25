import React, { useState, useEffect } from 'react'
import TransactionCard from '../components/TransactionCard'
import { bankingStore } from '../services/bankingStore'
import './TransactionHistory.css'

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load transactions from banking store (includes all newly transferred money)
    const list = bankingStore.getTransactions()
    setTransactions(list)
    setFilteredTransactions(list)
  }, [])

  useEffect(() => {
    let filtered = transactions

    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(t =>
        (t.description && t.description.toLowerCase().includes(term)) ||
        (t.recipient && t.recipient.toLowerCase().includes(term)) ||
        (t.beneficiary && t.beneficiary.toLowerCase().includes(term)) ||
        (t.id && t.id.toString().toLowerCase().includes(term))
      )
    }

    setFilteredTransactions(filtered)
  }, [filter, searchTerm, transactions])

  return (
    <div className="transaction-history-page">
      <div className="page-header">
        <div>
          <h1>Transaction History</h1>
          <p>View all your transactions and activity</p>
        </div>
      </div>

      <div className="filters-bar card">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'credit' ? 'active' : ''}`}
            onClick={() => setFilter('credit')}
          >
            Credits
          </button>
          <button
            className={`filter-btn ${filter === 'debit' ? 'active' : ''}`}
            onClick={() => setFilter('debit')}
          >
            Debits
          </button>
        </div>
      </div>

      <div className="transactions-container">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="no-transactions">
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}