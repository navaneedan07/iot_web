import { useEffect, useState } from 'react'
import api from '../api'

const rankColors = [
  'bg-amber-400 text-white',   // gold
  'bg-slate-400 text-white',   // silver
  'bg-amber-700 text-white',   // bronze
]

export default function LeaderboardPage () {
  const [scope, setScope] = useState('global')
  const [rows, setRows] = useState([])
  const [scopes, setScopes] = useState([{ value: 'global', label: 'Global' }])

  // Build scopes from stored user profile
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    api.get('/users/me').then(res => {
      const u = res.data
      const s = [{ value: 'global', label: 'Global' }]
      if (u.college) s.push({ value: `college:${u.college}`, label: u.college })
      if (u.city) s.push({ value: `city:${u.city}`, label: u.city })
      setScopes(s)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    api.get('/leaderboard', { params: { scope } }).then(res => setRows(res.data)).catch(() => setRows([]))
  }, [scope])

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="section-label mb-1">Rankings</p>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-sm text-slate-500 mt-1">Switch scopes to see how you stack locally vs globally.</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {scopes.map(s => (
            <button
              key={s.value}
              onClick={() => setScope(s.value)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                scope === s.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3 w-16">Rank</th>
              <th className="px-5 py-3">Player</th>
              <th className="px-5 py-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={`border-b border-slate-50 last:border-0 transition hover:bg-slate-50/80 ${idx < 3 ? 'bg-pink-50/30' : ''}`}>
                <td className="px-5 py-3.5">
                  {idx < 3 ? (
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${rankColors[idx]}`}>
                      {idx + 1}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium pl-1.5">#{idx + 1}</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                      {row.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{row.username}</p>
                      <p className="text-xs text-slate-400">{row.college || row.city || 'Global'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="font-bold text-pink-600">{row.status_score}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-4.5-9.5L12 4l4.5 7.5M6 8H4a1 1 0 01-1-1V5a1 1 0 011-1h2m12 4h2a1 1 0 001-1V5a1 1 0 00-1-1h-2" />
            </svg>
            <p className="text-sm text-slate-500 font-medium">No leaderboard data yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Rankings appear once people start posting</p>
          </div>
        )}
      </div>
    </div>
  )
}