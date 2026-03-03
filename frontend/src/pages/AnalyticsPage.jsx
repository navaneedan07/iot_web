import { useState, useEffect } from 'react'
import api from '../api'

/* ── SVG icon helpers ── */
const icons = {
  posts: <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  ratings: <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  given: <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  avg: <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  comments: <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  percentile: <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  ratingAct: <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  commentAct: <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
}

/* ── Progress bar ── */
function ProgressBar ({ label, value, max = 10, color = 'bg-pink-500' }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="group">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-medium capitalize text-slate-700">{label}</span>
        <span className="text-slate-400 tabular-nums">{value ?? '–'}<span className="text-slate-300">/{max}</span></span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ── Sparkline chart ── */
function Sparkline ({ data, width = 460, height = 140 }) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        <p className="text-sm">No score history yet</p>
        <p className="text-xs text-slate-300 mt-0.5">Upload and get rated to see your trend</p>
      </div>
    )
  }
  const scores = data.map(d => d.score)
  const mn = Math.min(...scores) - 1
  const mx = Math.max(...scores) + 1
  const range = mx - mn || 1
  const pad = 8
  const w = width - pad * 2
  const h = height - pad * 2
  const pts = scores.map((s, i) => {
    const x = pad + (i / (scores.length - 1 || 1)) * w
    const y = pad + h - ((s - mn) / range) * h
    return { x, y }
  })
  const line = pts.map(p => `${p.x},${p.y}`).join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(236,72,153)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="rgb(236,72,153)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pad},${pad + h} ${line} ${width - pad},${pad + h}`} fill="url(#areaGrad)" />
      <polyline points={line} fill="none" stroke="#ec4899" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke="#ec4899" strokeWidth="2" />
      ))}
    </svg>
  )
}

export default function AnalyticsPage () {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    setLoading(true)
    api.get(`/analytics?days=${days}`)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [days])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 border-[3px] border-slate-200 border-t-pink-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="card p-10 text-center space-y-3">
        <svg className="w-10 h-10 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        <h2 className="text-lg font-semibold text-slate-700">Login required</h2>
        <p className="text-sm text-slate-400">Sign in to view your analytics dashboard.</p>
      </div>
    )
  }

  const { overview, scoreTrend, categories, dimensions, activity } = data

  const stats = [
    { key: 'posts', label: 'Posts', value: overview.totalPosts, icon: icons.posts },
    { key: 'received', label: 'Ratings in', value: overview.totalRatingsReceived, icon: icons.ratings },
    { key: 'given', label: 'Ratings out', value: overview.ratingsGiven, icon: icons.given },
    { key: 'avg', label: 'Avg score', value: overview.avgPostScore, icon: icons.avg },
    { key: 'comments', label: 'Comments', value: overview.commentsGiven, icon: icons.comments },
    { key: 'percentile', label: 'Percentile', value: `${overview.percentileRank}%`, icon: icons.percentile },
  ]

  const dimConfig = [
    { key: 'presence', color: 'bg-pink-500' },
    { key: 'aesthetic', color: 'bg-pink-500' },
    { key: 'authority', color: 'bg-amber-500' },
    { key: 'intelligence', color: 'bg-blue-500' },
    { key: 'discipline', color: 'bg-emerald-500' },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="section-label mb-1">Performance</p>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-0.5">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                days === d ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.key} className="card-flat p-4 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              {s.icon}
            </div>
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Score trend + Dimensions ── */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Score trend</h2>
            <span className="pill-neutral">{days} days</span>
          </div>
          <Sparkline data={scoreTrend} />
          {scoreTrend.length > 0 && (
            <div className="flex justify-between text-[11px] text-slate-400 tabular-nums px-2">
              <span>{new Date(scoreTrend[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{new Date(scoreTrend.at(-1).date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 card p-5 space-y-4">
          <h2 className="text-base font-semibold">Dimension strengths</h2>
          {dimensions ? (
            <div className="space-y-3.5">
              {dimConfig.map(({ key, color }) => (
                <ProgressBar key={key} label={key} value={dimensions[key]} color={color} />
              ))}
              <p className="text-[11px] text-slate-400 text-right tabular-nums">{dimensions.totalRatings} ratings analyzed</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <svg className="w-7 h-7 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <p className="text-sm">No ratings received yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Categories + Activity ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5 space-y-4">
          <h2 className="text-base font-semibold">Category breakdown</h2>
          {categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((c, i) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-5 text-xs text-slate-400 tabular-nums text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium truncate">{c.category}</span>
                      <span className="text-slate-500 tabular-nums ml-2">{c.avgScore}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-pink-500 transition-all duration-700" style={{ width: `${Math.round((c.avgScore / 10) * 100)}%` }} />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 tabular-nums whitespace-nowrap">{c.totalPosts}p</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <svg className="w-7 h-7 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a1.969 1.969 0 011.414.586l6.828 6.828a2 2 0 010 2.828l-5.657 5.657a2 2 0 01-2.828 0L4.929 12.07A2 2 0 014.343 10.656V5.343A2 2 0 016.343 3H7z" /></svg>
              <p className="text-sm">No scored categories yet</p>
            </div>
          )}
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="text-base font-semibold">Recent activity</h2>
          {activity.length > 0 ? (
            <ul className="space-y-1 max-h-80 overflow-y-auto pr-1">
              {activity.map((a, i) => (
                <li key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="mt-0.5 shrink-0">
                    {a.type === 'rating' ? icons.ratingAct : icons.commentAct}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium text-slate-800">{a.username}</span>
                      {a.type === 'rating'
                        ? <span className="text-slate-500"> rated your <span className="font-medium text-slate-700">{a.category}</span> post — <span className="font-semibold text-pink-600">{Number(a.value).toFixed(1)}</span></span>
                        : <span className="text-slate-500"> commented on <span className="font-medium text-slate-700">{a.category}</span></span>
                      }
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(a.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <svg className="w-7 h-7 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm">No activity yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Status score ── */}
      <div className="card p-8 flex flex-col items-center text-center space-y-3">
        <div className="w-24 h-24 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center">
          <span className="text-4xl font-bold text-pink-600 tabular-nums">{overview.statusScore}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">Your Status Score</p>
          <p className="text-xs text-slate-400 mt-0.5">Keep posting and engaging to improve</p>
        </div>
      </div>
    </div>
  )
}

function timeAgo (dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const d = Math.floor(hrs / 24)
  return `${d}d ago`
}
