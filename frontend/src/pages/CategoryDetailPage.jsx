import { Link, useParams, Navigate } from 'react-router-dom'
import { categoryGroups } from '../data/categories'

function findCategory (nameParam) {
  const decoded = decodeURIComponent(nameParam).toLowerCase()
  for (const group of categoryGroups) {
    for (const cat of group.categories) {
      if (cat.name.toLowerCase() === decoded) return { group, cat }
    }
  }
  return null
}

export default function CategoryDetailPage () {
  const { name } = useParams()
  const match = findCategory(name)

  if (!match) return <Navigate to="/categories" replace />

  const { group, cat } = match

  return (
    <div className="space-y-6">
      {/* breadcrumb area */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/categories" className="hover:text-pink-600 transition">Categories</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-500">{group.title}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{cat.name}</h1>
          <p className="text-sm text-slate-500 mt-1">Scored on: {cat.scores.join(', ')}</p>
        </div>
        <Link to="/upload" className="btn-primary text-sm shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload to this category
        </Link>
      </div>

      {/* scoring rubric */}
      <div className="card p-5 space-y-4">
        <h2 className="font-bold text-base">Scoring rubric</h2>
        <div className="flex flex-wrap gap-2">
          {cat.scores.map(score => (
            <span key={score} className="text-xs px-2.5 py-1 rounded-lg bg-pink-50 text-pink-600 font-medium border border-pink-100/70">{score}</span>
          ))}
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">Keep it tight: aim for 20-45s video or a clear before/after. Good lighting, stable framing, captions, and clean audio boost engagement.</p>
      </div>

      {/* tips */}
      <div className="card p-5 space-y-3">
        <h3 className="font-bold text-base">Tips to score higher</h3>
        <ul className="space-y-2">
          {[
            'Show evidence for each scoring dimension (e.g., close-up of details, side-by-side progress).',
            'Lead with a hook in the first 3 seconds to stop the scroll.',
            'Add captions and keep background noise low; music optional but avoid copyright tracks.'
          ].map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-600">
              <div className="w-5 h-5 rounded-full bg-pink-50 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-pink-600">{i + 1}</span>
              </div>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* footer nav */}
      <div className="flex items-center gap-4 text-sm">
        <Link to="/categories" className="text-slate-400 hover:text-pink-600 transition flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to categories
        </Link>
        <span className="text-slate-200">|</span>
        <Link to="/upload" className="text-pink-600 hover:text-pink-800 font-medium transition">Go upload</Link>
      </div>
    </div>
  )
}