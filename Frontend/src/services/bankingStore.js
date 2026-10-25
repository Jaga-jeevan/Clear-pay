// Central Banking Store for ClearPay (syncs state across Dashboard, Transfer, History, and Alerts)

const DEFAULT_BALANCE = 15432.50

const DEFAULT_TRANSACTIONS = [
  { id: 'TXN-1001', type: 'credit', amount: 2500, description: 'Salary Deposit', recipient: 'Employer Payroll', date: '2024-01-15', status: 'completed', fraudScore: 0.05 },
  { id: 'TXN-1002', type: 'debit', amount: 150, description: 'Grocery Store', recipient: 'Supermarket Express', date: '2024-01-14', status: 'completed', fraudScore: 0.12 },
  { id: 'TXN-1003', type: 'debit', amount: 5000, description: 'Large Purchase', recipient: 'Electronics Store', date: '2024-01-14', status: 'flagged', fraudScore: 0.85 },
  { id: 'TXN-1004', type: 'debit', amount: 75.50, description: 'Gas Station', recipient: 'Fuel Station #4', date: '2024-01-13', status: 'completed', fraudScore: 0.08 },
  { id: 'TXN-1005', type: 'credit', amount: 300, description: 'Freelance Payment', recipient: 'Client Invoice', date: '2024-01-12', status: 'completed', fraudScore: 0.15 },
  { id: 'TXN-1006', type: 'debit', amount: 1200, description: 'Rent Payment', recipient: 'Jane Smith (****5678)', date: '2024-01-12', status: 'completed', fraudScore: 0.22 },
  { id: 'TXN-1007', type: 'debit', amount: 45, description: 'Coffee Shop', recipient: 'Cafe Central', date: '2024-01-11', status: 'completed', fraudScore: 0.04 },
  { id: 'TXN-1008', type: 'credit', amount: 500, description: 'Refund', recipient: 'Online Store', date: '2024-01-10', status: 'completed', fraudScore: 0.18 }
]

const DEFAULT_ALERTS = [
  {
    id: 'ALT-1',
    type: 'high',
    title: 'High-Risk Transaction Detected',
    message: 'A transaction of ₹5,000 was flagged by our AI system due to unusual activity patterns.',
    timestamp: '2024-01-15 14:30:00',
    read: false
  },
  {
    id: 'ALT-2',
    type: 'medium',
    title: 'New Device Login',
    message: 'Your account was accessed from a new device.',
    timestamp: '2024-01-14 09:15:00',
    read: false
  },
  {
    id: 'ALT-3',
    type: 'low',
    title: 'Password Change Reminder',
    message: "It's been 90 days since your last password change. Consider updating it for security.",
    timestamp: '2024-01-13 16:45:00',
    read: true
  }
]

const DEFAULT_BENEFICIARIES = [
  { id: 1, name: 'John Doe', account: '****1234', bank: 'State Bank' },
  { id: 2, name: 'Jane Smith', account: '****5678', bank: 'HDFC Bank' },
  { id: 3, name: 'Bob Johnson', account: '****9012', bank: 'ICICI Bank' },
  { id: 4, name: 'Alice Williams', account: '****3456', bank: 'Axis Bank' }
]

export const bankingStore = {
  // Balance
  getBalance: () => {
    const saved = localStorage.getItem('clearpay_balance')
    if (saved !== null) {
      const val = parseFloat(saved)
      return isNaN(val) ? DEFAULT_BALANCE : val
    }
    localStorage.setItem('clearpay_balance', DEFAULT_BALANCE.toString())
    return DEFAULT_BALANCE
  },

  updateBalance: (newBalance) => {
    localStorage.setItem('clearpay_balance', newBalance.toString())
    return newBalance
  },

  deductBalance: (amount) => {
    const current = bankingStore.getBalance()
    const updated = Math.max(0, current - amount)
    return bankingStore.updateBalance(updated)
  },

  // Transactions
  getTransactions: () => {
    const saved = localStorage.getItem('clearpay_transactions')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved transactions', e)
      }
    }
    localStorage.setItem('clearpay_transactions', JSON.stringify(DEFAULT_TRANSACTIONS))
    return DEFAULT_TRANSACTIONS
  },

  addTransaction: (transaction) => {
    const current = bankingStore.getTransactions()
    const updated = [transaction, ...current]
    localStorage.setItem('clearpay_transactions', JSON.stringify(updated))
    return updated
  },

  // Alerts
  getAlerts: () => {
    const saved = localStorage.getItem('clearpay_alerts')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved alerts', e)
      }
    }
    localStorage.setItem('clearpay_alerts', JSON.stringify(DEFAULT_ALERTS))
    return DEFAULT_ALERTS
  },

  addAlert: (alert) => {
    const current = bankingStore.getAlerts()
    const updated = [alert, ...current]
    localStorage.setItem('clearpay_alerts', JSON.stringify(updated))
    return updated
  },

  markAlertAsRead: (alertId) => {
    const current = bankingStore.getAlerts()
    const updated = current.map(a => a.id === alertId ? { ...a, read: true } : a)
    localStorage.setItem('clearpay_alerts', JSON.stringify(updated))
    return updated
  },

  markAllAlertsAsRead: () => {
    const current = bankingStore.getAlerts()
    const updated = current.map(a => ({ ...a, read: true }))
    localStorage.setItem('clearpay_alerts', JSON.stringify(updated))
    return updated
  },

  // Beneficiaries
  getBeneficiaries: () => {
    const saved = localStorage.getItem('clearpay_beneficiaries')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved beneficiaries', e)
      }
    }
    localStorage.setItem('clearpay_beneficiaries', JSON.stringify(DEFAULT_BENEFICIARIES))
    return DEFAULT_BENEFICIARIES
  },

  addBeneficiary: (beneficiary) => {
    const current = bankingStore.getBeneficiaries()
    const newId = current.length > 0 ? Math.max(...current.map(b => Number(b.id) || 0)) + 1 : 1
    const newBen = { id: newId, ...beneficiary }
    const updated = [...current, newBen]
    localStorage.setItem('clearpay_beneficiaries', JSON.stringify(updated))
    return updated
  },

  updateBeneficiary: (id, updatedData) => {
    const current = bankingStore.getBeneficiaries()
    const updated = current.map(b => b.id.toString() === id.toString() ? { ...b, ...updatedData } : b)
    localStorage.setItem('clearpay_beneficiaries', JSON.stringify(updated))
    return updated
  },

  deleteBeneficiary: (id) => {
    const current = bankingStore.getBeneficiaries()
    const updated = current.filter(b => b.id.toString() !== id.toString())
    localStorage.setItem('clearpay_beneficiaries', JSON.stringify(updated))
    return updated
  }
}
