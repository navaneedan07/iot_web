import './ExpenseSummary.css'

function ExpenseSummary({ expenses }) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  const monthlyExpenses = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return expenses.filter(expense => {
      const date = new Date(expense.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).reduce((sum, expense) => sum + expense.amount, 0)
  }

  const averageExpense = expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : 0

  return (
    <div className="expense-summary">
      <h2>Summary</h2>
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon">💵</div>
          <div className="summary-content">
            <div className="summary-label">Total Expenses</div>
            <div className="summary-value">${totalExpenses.toFixed(2)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <div className="summary-label">This Month</div>
            <div className="summary-value">${monthlyExpenses().toFixed(2)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <div className="summary-label">Average Expense</div>
            <div className="summary-value">${averageExpense}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <div className="summary-label">Total Entries</div>
            <div className="summary-value">{expenses.length}</div>
          </div>
        </div>
      </div>

      {topCategory && (
        <div className="top-category">
          <h3>Top Category</h3>
          <div className="category-stats">
            <span className="category-name">{topCategory[0]}</span>
            <span className="category-amount">${topCategory[1].toFixed(2)}</span>
          </div>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="category-breakdown">
          <h3>Breakdown by Category</h3>
          <div className="category-list">
            {Object.entries(categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => (
                <div key={category} className="category-item">
                  <div className="category-bar">
                    <div className="category-label">{category}</div>
                    <div className="category-progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${(amount / totalExpenses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="category-percentage">
                    {((amount / totalExpenses) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseSummary
