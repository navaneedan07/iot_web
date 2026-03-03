import { Link } from 'react-router-dom'
import { categoryGroups } from '../data/categories'

export default function CategoriesPage () {
  return (
    <div className="space-y-8">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="section-label mb-1">Playbooks</p>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Each card shows what the community scores. Use this to script your uploads.</p>
        </div>
        <Link to="/upload" className="btn-primary text-sm shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Upload now
        </Link>
      </div>

      {/* track filter */}
      <div className="flex flex-wrap gap-2">
        {categoryGroups.map(group => (
          <a
            key={group.id}
            href={`#${group.id}`}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-pink-300 hover:text-pink-600 text-xs font-medium text-slate-600 transition"
          >
            {group.title}
          </a>
        ))}
      </div>

      {/* groups */}
      <div className="space-y-10">
        {categoryGroups.map(group => (
          <section key={group.id} id={group.id} className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{group.mood}</p>
                <h2 className="text-2xl font-bold mt-0.5">{group.title}</h2>
              </div>
              <Link to="/upload" className="text-xs font-medium text-pink-600 hover:text-pink-800 transition flex items-center gap-1">
                Upload to this track
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.categories.map(cat => (
                <article key={cat.name} className="card p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/categories/${encodeURIComponent(cat.name)}`} className="font-bold text-base text-slate-800 hover:text-pink-600 transition">
                      {cat.name}
                    </Link>
                    <span className="pill-neutral shrink-0">{group.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.scores.map(score => (
                      <span key={score} className="text-[11px] px-2 py-0.5 rounded-md bg-pink-50 text-pink-600 font-medium">{score}</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aim for a 20-30s clip or a clear before/after. Keep audio clean; add captions.
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}