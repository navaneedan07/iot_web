import { useEffect, useState } from 'react'
import api from '../api'

function VoteBar ({ left, right }) {
  const total = left + right
  const pctL = total ? Math.round((left / total) * 100) : 50
  const pctR = total ? 100 - pctL : 50
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold tabular-nums">
        <span className="text-pink-600">{pctL}%</span>
        <span className="text-slate-500">{total} vote{total !== 1 ? 's' : ''}</span>
        <span className="text-slate-600">{pctR}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden flex">
        <div className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-l-full transition-all duration-700 ease-out" style={{ width: `${pctL}%` }} />
        <div className="h-full bg-slate-300 rounded-r-full transition-all duration-700 ease-out" style={{ width: `${pctR}%` }} />
      </div>
    </div>
  )
}

function MediaThumb ({ url, type }) {
  if (!url) return (
    <div className="w-full aspect-[4/3] bg-slate-50 rounded-xl flex items-center justify-center">
      <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    </div>
  )
  const src = url.startsWith('http') ? url : `/uploads/${url.replace(/^\/?uploads\//, '')}`
  if (type?.startsWith('video')) {
    return <video src={src} className="w-full aspect-[4/3] object-cover rounded-xl bg-black" muted loop onMouseEnter={e => e.target.play()} onMouseLeave={e => e.target.pause()} />
  }
  return <img src={src} alt="" className="w-full aspect-[4/3] object-cover rounded-xl" />
}

export default function BattlePage () {
  const [battles, setBattles] = useState([])
  const [matching, setMatching] = useState(false)
  const [matchError, setMatchError] = useState('')
  const [votedBattles, setVotedBattles] = useState(new Set())
  const isAuthed = Boolean(localStorage.getItem('token'))

  const load = () => api.get('/battles').then(res => setBattles(res.data)).catch(() => setBattles([]))
  useEffect(() => { load() }, [])

  const autoMatch = async () => {
    setMatching(true)
    setMatchError('')
    try {
      await api.post('/battles/auto-match')
      load()
    } catch (err) {
      setMatchError(err.response?.data?.message || 'No matches available')
    } finally {
      setMatching(false)
    }
  }

  const vote = async (battleId, voteFor) => {
    if (votedBattles.has(battleId)) return
    try {
      await api.post('/battles/vote', { battleId, voteFor })
      setVotedBattles(prev => new Set([...prev, battleId]))
      load()
    } catch (err) {
      // already voted — mark it so
      if (err.response?.status === 409 || err.response?.data?.message?.includes('already')) {
        setVotedBattles(prev => new Set([...prev, battleId]))
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="section-label mb-1">Battle mode</p>
          <h1 className="text-3xl font-bold tracking-tight">Head-to-head</h1>
          <p className="text-sm text-slate-500 mt-1">Pick the stronger entry. Votes push status scores in real time.</p>
        </div>
        {isAuthed && (
          <button onClick={autoMatch} disabled={matching} className="btn-primary text-sm shrink-0 disabled:opacity-50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            {matching ? 'Matching...' : 'Start a battle'}
          </button>
        )}
      </div>

      {matchError && (
        <div className="flex items-center gap-2 text-sm text-pink-600 bg-pink-50 border border-pink-100 rounded-xl px-4 py-2.5">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {matchError}
        </div>
      )}

      {/* battle cards */}
      <div className="space-y-5">
        {battles.map(battle => {
          const cVotes = Number(battle.challenger_votes) || 0
          const oVotes = Number(battle.opponent_votes) || 0
          const hasVoted = votedBattles.has(battle.id)
          return (
            <div key={battle.id} className="card p-0 overflow-hidden">
              {/* header bar */}
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-700">{battle.challenger}</span>
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">vs</span>
                  <span className="font-semibold text-slate-700">{battle.opponent}</span>
                </div>
                <div className="flex items-center gap-2">
                  {battle.category && <span className="pill">{battle.category}</span>}
                  <span className="pill-neutral">{battle.status}</span>
                </div>
              </div>

              {/* media + vote side by side */}
              <div className="grid grid-cols-2">
                <button
                  onClick={() => vote(battle.id, battle.challenger_post_id)}
                  disabled={hasVoted}
                  className={`group p-4 text-left transition border-r border-slate-100 ${hasVoted ? 'cursor-default' : 'hover:bg-pink-50/40'}`}
                >
                  <MediaThumb url={battle.challenger_media} type={battle.challenger_media_type} />
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{battle.challenger}</p>
                    {battle.challenger_caption && <p className="text-xs text-slate-400 line-clamp-2">{battle.challenger_caption}</p>}
                  </div>
                  {!hasVoted && (
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-.95-.24L7 19m7-9V5a2 2 0 00-2-2h-.095a2 2 0 00-1.957 1.608L7 13m7-8H5.236a2 2 0 00-1.789 2.894l.5 1" /></svg>
                        Vote
                      </span>
                    </div>
                  )}
                </button>
                <button
                  onClick={() => vote(battle.id, battle.opponent_post_id)}
                  disabled={hasVoted}
                  className={`group p-4 text-left transition ${hasVoted ? 'cursor-default' : 'hover:bg-pink-50/40'}`}
                >
                  <MediaThumb url={battle.opponent_media} type={battle.opponent_media_type} />
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{battle.opponent}</p>
                    {battle.opponent_caption && <p className="text-xs text-slate-400 line-clamp-2">{battle.opponent_caption}</p>}
                  </div>
                  {!hasVoted && (
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-.95-.24L7 19m7-9V5a2 2 0 00-2-2h-.095a2 2 0 00-1.957 1.608L7 13m7-8H5.236a2 2 0 00-1.789 2.894l.5 1" /></svg>
                        Vote
                      </span>
                    </div>
                  )}
                </button>
              </div>

              {/* vote bar */}
              <div className="px-5 py-3 border-t border-slate-100">
                <VoteBar left={cVotes} right={oVotes} />
              </div>
            </div>
          )
        })}
      </div>

      {battles.length === 0 && (
        <div className="card p-0">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-700">No battles yet</p>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">
              Click "Start a battle" to auto-match two posts in the same category
            </p>
          </div>
        </div>
      )}
    </div>
  )
}