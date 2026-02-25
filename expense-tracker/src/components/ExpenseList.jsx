import { useState } from 'react'
import ExpenseItem from './ExpenseItem'
import './ExpenseList.css'

function ExpenseList({ expenses, onDeleteExpense, onUpdateExpense }) {
  const [sortBy, setSortBy] = useState('date')
  const [filterCategory, setFilterCategory] = useState('All')

  const categories = ['All', ...new Set(expenses.map(e => e.category))]

  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === filterCategory)

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date)
      case 'amount-high':
        return b.amount - a.amount
      case 'amount-low':
        return a.amount - b.amount
      case 'description':
        return a.description.localeCompare(b.description)
      default:
        return 0
    }
  })

  if (expenses.length === 0) {
    return (
      <div className="expense-list">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No expenses yet</h3>
          <p>Start adding expenses to track your spending</p>
        </div>
      </div>
    )
  }

  return (
    <div className="expense-list">
      <div className="list-header">
        <h2>Expense History</h2>
        <div className="list-controls">
          <div className="control-group">
            <label htmlFor="filter">Category:</label>
            <select
              id="filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date (Newest)</option>
              <option value="amount-high">Amount (High to Low)</option>
              <option value="amount-low">Amount (Low to High)</option>
              <option value="description">Description (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="expense-items">
        {sortedExpenses.map(expense => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onDelete={onDeleteExpense}
            onUpdate={onUpdateExpense}
          />
        ))}
      </div>

      {filteredExpenses.length === 0 && filterCategory !== 'All' && (
        <div className="no-results">
          <p>No expenses in {filterCategory} category</p>
        </div>
      )}
    </div>
  )
}

export default ExpenseList
