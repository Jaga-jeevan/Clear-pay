import React, { useState, useEffect } from 'react'
import { bankingStore } from '../services/bankingStore'
import './Beneficiaries.css'

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingBeneficiary, setEditingBeneficiary] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    account: '',
    bank: ''
  })

  useEffect(() => {
    setBeneficiaries(bankingStore.getBeneficiaries())
  }, [])

  const openAddModal = () => {
    setEditingBeneficiary(null)
    setFormData({ name: '', account: '', bank: '' })
    setShowModal(true)
  }

  const openEditModal = (beneficiary) => {
    setEditingBeneficiary(beneficiary)
    setFormData({
      name: beneficiary.name,
      account: beneficiary.account,
      bank: beneficiary.bank
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBeneficiary(null)
    setFormData({ name: '', account: '', bank: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingBeneficiary) {
      const updated = bankingStore.updateBeneficiary(editingBeneficiary.id, {
        name: formData.name.trim(),
        account: formData.account.trim(),
        bank: formData.bank.trim()
      })
      setBeneficiaries(updated)
    } else {
      const updated = bankingStore.addBeneficiary({
        name: formData.name.trim(),
        account: formData.account.trim(),
        bank: formData.bank.trim()
      })
      setBeneficiaries(updated)
    }
    closeModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this beneficiary?')) {
      const updated = bankingStore.deleteBeneficiary(id)
      setBeneficiaries(updated)
    }
  }

  return (
    <div className="beneficiaries-page">
      <div className="page-header">
        <div>
          <h1>Beneficiaries</h1>
          <p>Manage your saved beneficiaries</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Beneficiary
        </button>
      </div>

      <div className="beneficiaries-grid">
        {beneficiaries.map(beneficiary => (
          <div key={beneficiary.id} className="beneficiary-card card">
            <div className="beneficiary-avatar">
              {beneficiary.name.charAt(0)}
            </div>
            <div className="beneficiary-info">
              <h3>{beneficiary.name}</h3>
              <p className="beneficiary-account">{beneficiary.account}</p>
              <p className="beneficiary-bank">{beneficiary.bank}</p>
            </div>
            <div className="beneficiary-actions">
              <button
                type="button"
                className="btn-action btn-edit"
                onClick={() => openEditModal(beneficiary)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-action btn-delete"
                onClick={() => handleDelete(beneficiary.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBeneficiary ? 'Edit Beneficiary' : 'Add New Beneficiary'}</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="input-group">
                <label>Account Number</label>
                <input
                  type="text"
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  placeholder="e.g. 1234567890"
                  required
                />
              </div>
              <div className="input-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  placeholder="e.g. State Bank of India"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBeneficiary ? 'Save Changes' : 'Add Beneficiary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}