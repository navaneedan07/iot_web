import { useState } from 'react'
import './ExpenseItem.css'

function ExpenseItem({ expense, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(expense)

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }))
  }

  const handleSave = () => {
    if (!editData.description.trim() || !editData.amount) {
      alert('Please fill in all fields')
      return
    }
    onUpdate(expense.id, editData)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Food': '🍔',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Healthcare': '⚕️',
      'Education': '📚',
      'Other': '📦'
    }
    return emojis[category] || '📦'
  }

  if (isEditing) {
    return (
      <div className="expense-item editing">
        <div className="edit-form">
          <input
            type="text"
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            maxLength="50"
          />
          <input
            type="number"
            name="amount"
            value={editData.amount}
            onChange={handleEditChange}
            step="0.01"
            min="0"
          />
          <input
            type="date"
            name="date"
            value={editData.date}
            onChange={handleEditChange}
          />
          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSave}>✓ Save</button>
            <button className="cancel-btn" onClick={() => {
              setIsEditing(false)
              setEditData(expense)
            }}>✕ Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="expense-item">
      <div className="expense-left">
        <div className="category-icon">
          {getCategoryEmoji(expense.category)}
        </div>
        <div className="expense-details">
          <div className="expense-description">{expense.description}</div>
          <div className="expense-meta">
            <span className="category-badge">{expense.category}</span>
            <span className="expense-date">{formatDate(expense.date)}</span>
          </div>
        </div>
      </div>

      <div className="expense-right">
        <div className="expense-amount">${expense.amount.toFixed(2)}</div>
        <div className="expense-actions">
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(true)}
            title="Edit expense"
          >
            ✏️
          </button>
          <button
            className="delete-btn"
            onClick={() => onDelete(expense.id)}
            title="Delete expense"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpenseItem
