import { useEffect, useState } from 'react'
import api from '../api'
import { categoryGroups } from '../data/categories'

const allCategories = categoryGroups.flatMap(group => group.categories.map(cat => cat.name))

export default function UploadPage () {
  const [category, setCategory] = useState(allCategories[0])
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!file) return setPreview('')
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return setStatus('Add a media file first.')
    const form = new FormData()
    form.append('media', file)
    form.append('category', category)
    form.append('caption', caption)
    setSubmitting(true)
    setStatus('')
    try {
      await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setStatus('Uploaded — awaiting moderation.')
      setCaption('')
      setFile(null)
      setPreview('')
    } catch (err) {
      setStatus(err.response?.data?.message || 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="section-label mb-1">Create</p>
          <h1 className="text-3xl font-bold tracking-tight">Upload a post</h1>
          <p className="text-sm text-slate-500 mt-1">Share your best content — good lighting, clean audio, caption for silent viewers.</p>
        </div>
      </div>

      <form onSubmit={submit} className="card p-0 overflow-hidden">
        <div className="grid lg:grid-cols-5">
          {/* form side */}
          <div className="lg:col-span-3 p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm">
                {categoryGroups.map(group => (
                  <optgroup key={group.id} label={group.title}>
                    {group.categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Caption</label>
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm min-h-[120px] resize-none"
                placeholder="What should viewers notice?"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Media file</label>
              <label className="group flex items-center gap-4 px-4 py-5 border-2 border-dashed border-slate-200 rounded-xl hover:border-pink-300 hover:bg-pink-50/30 transition cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Choose a file or drag it here</p>
                  <p className="text-xs text-slate-400">Image or video, up to 50 MB</p>
                </div>
                <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files[0])} className="hidden" />
              </label>
              {file && <p className="text-xs text-slate-500 mt-1">Selected: <span className="font-medium">{file.name}</span></p>}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                {submitting ? 'Uploading...' : 'Upload'}
              </button>
              {status && <span className="text-sm text-slate-600 font-medium">{status}</span>}
            </div>
          </div>

          {/* preview side */}
          <div className="lg:col-span-2 p-6 bg-slate-50/50 space-y-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Preview</p>
            <div className="rounded-xl border border-slate-200 bg-white min-h-[260px] flex items-center justify-center overflow-hidden">
              {preview && file?.type?.startsWith('image') && (
                <img src={preview} alt="preview" className="w-full object-cover" />
              )}
              {preview && file?.type?.startsWith('video') && (
                <video controls className="w-full"><source src={preview} type={file.type} /></video>
              )}
              {!preview && (
                <div className="text-center p-6">
                  <svg className="w-8 h-8 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-xs text-slate-400">Your media will appear here</p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-1">
              <p className="text-xs font-medium text-slate-600">Moderation</p>
              <p className="text-xs text-slate-400">Posts are reviewed for safety before going live. Flagged content stays in review.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}