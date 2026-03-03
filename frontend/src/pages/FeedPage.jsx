import { useEffect, useMemo, useState } from 'react'
import api from '../api'

const DIMS = ['presence', 'aesthetic', 'authority', 'intelligence', 'discipline']

export default function FeedPage () {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRateId, setExpandedRateId] = useState(null)
  const [ratingByPost, setRatingByPost] = useState({})
  const [submittingPostId, setSubmittingPostId] = useState(null)
  const [rateStatusByPost, setRateStatusByPost] = useState({})
  const [commentsByPost, setCommentsByPost] = useState({})
  const [commentInputByPost, setCommentInputByPost] = useState({})
  const [commentStatusByPost, setCommentStatusByPost] = useState({})
  const [commentSubmittingPostId, setCommentSubmittingPostId] = useState(null)
  const [deletingPostId, setDeletingPostId] = useState(null)

  const isAuthed = Boolean(localStorage.getItem('token'))
  const savedUser = localStorage.getItem('user')
  const currentUser = savedUser ? JSON.parse(savedUser) : null

  useEffect(() => {
    api.get('/posts').then(res => setPosts(res.data)).catch(() => setPosts([])).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!posts.length) return
    Promise.all(posts.map(async (post) => {
      try { const res = await api.get(`/comments/post/${post.id}`); return { postId: post.id, comments: res.data } }
      catch { return { postId: post.id, comments: [] } }
    })).then(results => {
      const map = {}
      results.forEach(({ postId, comments }) => { map[postId] = comments })
      setCommentsByPost(map)
    })
  }, [posts])

  const openRateForm = (postId) => {
    setExpandedRateId(prev => (prev === postId ? null : postId))
    setRateStatusByPost(prev => ({ ...prev, [postId]: '' }))
    setRatingByPost(prev => ({ ...prev, [postId]: prev[postId] || { presence: 8, aesthetic: 8, authority: 8, intelligence: 8, discipline: 8 } }))
  }

  const updateRating = (postId, key, value) => {
    setRatingByPost(prev => ({
      ...prev,
      [postId]: { ...(prev[postId] || { presence: 8, aesthetic: 8, authority: 8, intelligence: 8, discipline: 8 }), [key]: Number(value) }
    }))
  }

  const submitRating = async (postId) => {
    if (!isAuthed) { setRateStatusByPost(prev => ({ ...prev, [postId]: 'Login to rate.' })); return }
    const values = ratingByPost[postId]
    if (!values) return
    setSubmittingPostId(postId)
    setRateStatusByPost(prev => ({ ...prev, [postId]: '' }))
    try {
      await api.post('/ratings', { postId, ...values })
      setRateStatusByPost(prev => ({ ...prev, [postId]: 'Rating submitted!' }))
      setExpandedRateId(null)
      setPosts(prev => prev.map(post => {
        if (post.id !== postId) return post
        const total = values.presence + values.aesthetic + values.authority + values.intelligence + values.discipline
        const ws = Math.round((total / 5) * 10) / 10
        const nextCount = Number(post.ratings_count || 0) + 1
        const prevTotal = Number(post.score || 0) * Number(post.ratings_count || 0)
        return { ...post, score: Math.round(((prevTotal + ws) / nextCount) * 10) / 10, ratings_count: nextCount }
      }))
    } catch (err) {
      setRateStatusByPost(prev => ({ ...prev, [postId]: err.response?.data?.message || 'Rating failed' }))
    } finally { setSubmittingPostId(null) }
  }

  const submitComment = async (postId) => {
    const content = (commentInputByPost[postId] || '').trim()
    if (!isAuthed) { setCommentStatusByPost(prev => ({ ...prev, [postId]: 'Login to comment.' })); return }
    if (!content) return
    setCommentSubmittingPostId(postId)
    setCommentStatusByPost(prev => ({ ...prev, [postId]: '' }))
    try {
      const res = await api.post('/comments', { postId, content })
      setCommentsByPost(prev => ({ ...prev, [postId]: [...(prev[postId] || []), res.data] }))
      setCommentInputByPost(prev => ({ ...prev, [postId]: '' }))
    } catch (err) {
      setCommentStatusByPost(prev => ({ ...prev, [postId]: err.response?.data?.message || 'Failed' }))
    } finally { setCommentSubmittingPostId(null) }
  }

  const heroCopy = useMemo(() => {
    if (loading) return 'Loading your feed...'
    if (!posts.length) return 'Nothing here yet. Be the first to post.'
    return `${posts.length} post${posts.length === 1 ? '' : 's'} from the community`
  }, [loading, posts.length])

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="section-label mb-1">Feed</p>
          <h1 className="text-3xl font-bold tracking-tight">Latest drops</h1>
          <p className="text-sm text-slate-500 mt-1">{heroCopy}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill-neutral">Live</span>
          <span className="pill-neutral">Moderated</span>
        </div>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100" />
                <div className="space-y-1.5 flex-1"><div className="h-3 w-24 bg-slate-100 rounded" /><div className="h-2 w-16 bg-slate-50 rounded" /></div>
              </div>
              <div className="h-48 bg-slate-100 rounded-xl" />
              <div className="h-3 w-32 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && !posts.length && (
        <div className="card p-10 text-center space-y-2">
          <svg className="w-10 h-10 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="text-sm font-medium text-slate-600">No posts yet</p>
          <p className="text-xs text-slate-400">Upload something to get the feed going.</p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map(post => (
          <article key={post.id} className="card overflow-hidden">
            {/* media */}
            <div className="bg-slate-100">
              {post.media_type?.startsWith('image') && (
                <img src={post.media_url} alt="" className="w-full aspect-[4/5] object-cover" loading="lazy" />
              )}
              {post.media_type?.startsWith('video') && (
                <video controls className="w-full aspect-[4/5] object-cover bg-black"><source src={post.media_url} type={post.media_type} /></video>
              )}
              {!post.media_type && <div className="aspect-[4/5] flex items-center justify-center text-slate-400 text-sm">No media</div>}
            </div>

            <div className="p-4 space-y-3">
              {/* user row */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-700 shrink-0">
                  {post.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{post.username || 'Anonymous'}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="pill">{post.category || 'General'}</span>
                    {post.created_at && <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  </div>
                </div>
                {currentUser?.id === post.user_id && (
                  <div className="flex items-center gap-1.5">
                    <span className="pill text-[10px]">You</span>
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this post? This cannot be undone.')) return
                        setDeletingPostId(post.id)
                        try {
                          await api.delete(`/posts/${post.id}`)
                          setPosts(prev => prev.filter(p => p.id !== post.id))
                        } catch (err) {
                          alert(err.response?.data?.message || 'Delete failed')
                        } finally { setDeletingPostId(null) }
                      }}
                      disabled={deletingPostId === post.id}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition disabled:opacity-50"
                      title="Delete post"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                )}
              </div>

              {post.caption && <p className="text-sm text-slate-600 leading-relaxed">{post.caption}</p>}

              {/* score row */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm">
                  <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  <span className="font-semibold tabular-nums">{post.score ?? '—'}</span>
                </div>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-400 tabular-nums">{post.ratings_count ?? 0} rating{(post.ratings_count ?? 0) !== 1 ? 's' : ''}</span>
                {post.moderation_status !== 'SAFE' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">{post.moderation_status}</span>
                )}
                {currentUser?.id !== post.user_id && (
                  <button
                    onClick={() => openRateForm(post.id)}
                    className="ml-auto text-xs font-medium text-pink-600 hover:text-pink-800 transition"
                  >
                    {expandedRateId === post.id ? 'Close' : 'Rate'}
                  </button>
                )}
              </div>

              {/* inline rating form */}
              {expandedRateId === post.id && currentUser?.id !== post.user_id && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate 0–10</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {DIMS.map(dim => (
                      <label key={dim} className="space-y-1">
                        <span className="text-xs font-medium text-slate-600 capitalize">{dim}</span>
                        <input
                          type="range" min="0" max="10"
                          value={ratingByPost[post.id]?.[dim] ?? 8}
                          onChange={e => updateRating(post.id, dim, e.target.value)}
                          className="w-full h-1.5 rounded-full appearance-none bg-slate-200 accent-pink-600 cursor-pointer"
                          style={{ border: 'none', padding: 0 }}
                        />
                        <span className="text-[11px] text-slate-400 tabular-nums">{ratingByPost[post.id]?.[dim] ?? 8}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button onClick={() => submitRating(post.id)} disabled={submittingPostId === post.id}
                      className="btn-primary text-xs py-1.5 px-4 disabled:opacity-50">
                      {submittingPostId === post.id ? 'Submitting...' : 'Submit'}
                    </button>
                    {rateStatusByPost[post.id] && <span className="text-xs text-slate-500">{rateStatusByPost[post.id]}</span>}
                  </div>
                </div>
              )}

              {/* comments */}
              <div className="border-t border-slate-100 pt-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Comments</span>
                  <span className="text-[11px] text-slate-400 tabular-nums">{(commentsByPost[post.id] || []).length}</span>
                </div>

                {(commentsByPost[post.id] || []).length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {(commentsByPost[post.id] || []).map(c => (
                      <div key={c.id} className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-[11px] text-slate-400">@{c.username} · {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className="text-sm text-slate-700">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentInputByPost[post.id] || ''}
                    onChange={e => setCommentInputByPost(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && submitComment(post.id)}
                    className="flex-1 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                    placeholder="Add a comment..."
                    maxLength={300}
                  />
                  <button
                    onClick={() => submitComment(post.id)}
                    disabled={commentSubmittingPostId === post.id}
                    className="px-3 py-1.5 text-xs font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
                {commentStatusByPost[post.id] && <p className="text-[11px] text-slate-400">{commentStatusByPost[post.id]}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
