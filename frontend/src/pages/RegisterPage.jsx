import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function RegisterPage () {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', college: '', city: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  const fields = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Your name', min: 2 },
    { key: 'username', label: 'Username', type: 'text', placeholder: 'letters and numbers', min: 3 },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: '8+ characters', min: 8 },
    { key: 'college', label: 'College (optional)', type: 'text', placeholder: 'e.g. MIT, Stanford' },
    { key: 'city', label: 'City (optional)', type: 'text', placeholder: 'e.g. New York' },
  ]

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-pink-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="text-sm text-slate-500 mt-1">Start posting and get scored by the community</p>
        </div>

        <div className="card p-6">
          <form onSubmit={submit} className="space-y-4">
            {fields.map(f => (
              <div key={f.key} className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{f.label}</label>
                <input
                  type={f.type}
                  required={!!f.min}
                  minLength={f.min}
                  value={form[f.key]}
                  onChange={e => update(f.key, e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                  placeholder={f.placeholder}
                />
              </div>
            ))}

            {error && (
              <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
              {submitting ? 'Creating account...' : 'Register'}
            </button>
          </form>
        </div>

        <p className="text-sm text-slate-500 text-center mt-5">
          Already have an account? <Link to="/login" className="text-pink-600 font-semibold hover:text-pink-800 transition">Sign in</Link>
        </p>
      </div>
    </div>
  )
}