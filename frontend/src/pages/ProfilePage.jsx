import { useEffect, useState } from 'react'
import api from '../api'

export default function ProfilePage () {
  const [user, setUser] = useState(null)
  const [history, setHistory] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '', college: '', city: '' })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    api.get('/users/me').then(res => {
      setUser(res.data)
      setForm({ name: res.data.name || '', bio: res.data.bio || '', college: res.data.college || '', city: res.data.city || '' })
    }).catch(() => setUser(null))
    api.get('/users/me/rank-history').then(res => setHistory(res.data)).catch(() => setHistory([]))
  }

  useEffect(() => { load() }, [])

  const saveProfile = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await api.put('/users/me', form)
      setUser(res.data)
      setSaveMsg('Saved!')
      setEditing(false)
      // Update stored user for nav display
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        localStorage.setItem('user', JSON.stringify({ ...parsed, name: res.data.name }))
      }
    } catch (err) {
      setSaveMsg(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await api.delete('/users/me')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account')
      setDeleting(false)
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-800">Login to view profile</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">Once authenticated, you'll see your score, rank history, and recent wins.</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Posts this week',
      value: user.posts_this_week ?? '—',
      icon: <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    {
      label: 'Avg score',
      value: user.avg_score ?? '—',
      icon: <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
    },
    {
      label: 'Ratings received',
      value: user.ratings_received ?? '—',
      icon: <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
  ]

  return (
    <div className="space-y-6">
      {/* profile header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              <button
                onClick={() => { setEditing(!editing); setSaveMsg('') }}
                className="text-xs font-medium text-pink-600 hover:text-pink-800 transition flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">@{user.username}</p>
            <p className="text-sm text-slate-500 mt-1.5 max-w-lg">{user.bio || 'Add a short bio to let people know who you are.'}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="pill">Status {user.status_score ?? '—'}</span>
              <span className="pill">Top {user.percentile_rank ?? '—'}%</span>
              {user.college && <span className="pill-neutral">{user.college}</span>}
              {user.city && <span className="pill-neutral">{user.city}</span>}
            </div>
          </div>
        </div>

        {/* edit form */}
        {editing && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Edit profile</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm" placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">College</label>
                <input type="text" value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm" placeholder="e.g. MIT, Stanford" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">City</label>
                <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm" placeholder="e.g. New York" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm min-h-[80px] resize-none"
                  placeholder="A short bio about yourself" maxLength={200} />
                <p className="text-[11px] text-slate-400 text-right">{form.bio.length}/200</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={saveProfile} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              {saveMsg && <span className="text-sm text-slate-600 font-medium">{saveMsg}</span>}
            </div>
          </div>
        )}
      </div>

      {/* danger zone */}
      <div className="card p-5 border border-red-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              Danger Zone
            </h3>
            <p className="text-xs text-slate-500 mt-1">Permanently delete your account and all associated data.</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition shrink-0"
          >
            Delete Account
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="mt-4 pt-4 border-t border-red-100 bg-red-50/50 -mx-5 -mb-5 px-5 pb-5 rounded-b-2xl">
            <p className="text-sm text-red-700 font-medium">Are you sure? This action cannot be undone.</p>
            <p className="text-xs text-red-500 mt-1">All your posts, ratings, battle votes, comments, and rank history will be permanently deleted.</p>
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, delete my account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="card-flat p-4 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
              {s.icon}
            </div>
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* rank history */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold">Rank history</h2>
          <span className="pill-neutral">{history.length} entries</span>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-sm text-slate-500">No history yet</p>
            <p className="text-xs text-slate-400">Earn some ratings to see your trajectory</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-2.5">Date</th>
                <th className="px-5 py-2.5 text-right">Score</th>
                <th className="px-5 py-2.5 text-right">Percentile</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                  <td className="px-5 py-3 text-slate-600">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-800">{item.status_score} pts</td>
                  <td className="px-5 py-3 text-right text-pink-600 font-medium">{item.percentile_rank}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}