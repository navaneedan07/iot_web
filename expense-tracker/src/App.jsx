import { useState, useEffect } from 'react'
import './App.css'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseSummary from './components/ExpenseSummary'

function App() {
  const [expenses, setExpenses] = useState(() => {
    // Load expenses from localStorage
    const saved = localStorage.getItem('expenses')
    return saved ? JSON.parse(saved) : []
  })

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now()
    }
    setExpenses([newExpense, ...expenses])
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...updatedExpense, id } : expense
    ))
  }

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>💰 Expense Tracker</h1>
          <p className="subtitle">Track and manage your expenses efficiently</p>
        </header>

        <div className="app-content">
          <div className="main-section">
            <ExpenseForm onAddExpense={addExpense} />
            <ExpenseSummary expenses={expenses} />
          </div>

          <div className="list-section">
            <ExpenseList 
              expenses={expenses}
              onDeleteExpense={deleteExpense}
              onUpdateExpense={updateExpense}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
