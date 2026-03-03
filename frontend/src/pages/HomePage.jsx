import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Anonymous ratings',
    text: 'Get honest campus feedback without public judgment.',
    icon: (
      <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  {
    title: 'Category scoring',
    text: 'Track how you perform in style, speaking, projects, and more.',
    icon: (
      <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a1.969 1.969 0 011.414.586l6.828 6.828a2 2 0 010 2.828l-5.657 5.657a2 2 0 01-2.828 0L4.929 12.07A2 2 0 014.343 10.656V5.343A2 2 0 016.343 3H7z" />
      </svg>
    )
  },
  {
    title: 'Growth dashboard',
    text: 'See score changes after every upload and improve faster.',
    icon: (
      <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  }
]

export default function HomePage () {
  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="card p-0 overflow-hidden">
        <div className="relative px-8 md:px-12 lg:px-16 py-14 md:py-20">
          {/* subtle gradient accent */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-50/60 to-transparent pointer-events-none" />
          <div className="relative max-w-2xl space-y-6">
            <p className="section-label">Campus-first feedback</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-slate-900">
              Get your 1-to-10 rating from real people
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              Post your campus moments, collect anonymous ratings, and improve your score with real feedback from students.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/register" className="btn-primary text-base px-7 py-3">Get my score</Link>
              <Link to="/login" className="btn-ghost text-base px-6 py-3">I already have an account</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid md:grid-cols-3 gap-4">
        {highlights.map(item => (
          <div key={item.title} className="card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}