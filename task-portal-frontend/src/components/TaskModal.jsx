import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { taskService } from '../services/taskService'
import toast from 'react-hot-toast'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

const empty = {
  title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '',
}

export default function TaskModal({ isOpen, onClose, onSave, editTask }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(editTask
        ? { ...editTask, dueDate: Array.isArray(editTask.dueDate) 
            ? `${editTask.dueDate[0]}-${String(editTask.dueDate[1]).padStart(2, '0')}-${String(editTask.dueDate[2]).padStart(2, '0')}` 
            : (typeof editTask.dueDate === 'string' ? editTask.dueDate.slice(0, 10) : '') }
        : empty
      )
      setErrors({})
    }
  }, [isOpen, editTask])

  if (!isOpen) return null

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    else if (form.title.length > 200) errs.title = 'Max 200 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAiGenerate = async () => {
    if (!form.title.trim()) {
      toast.error('Enter a task title first')
      return
    }
    setAiLoading(true)
    try {
      const result = await taskService.generateWithAi(form.title.trim())
      if (result.message) {
        toast.error(result.message)
      } else {
        setForm(prev => ({
          ...prev,
          description: result.description || prev.description,
          priority: result.priority || prev.priority,
        }))
        toast.success('AI generated task details!')
      }
    } catch {
      toast.error('AI generation failed. Try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || null,
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save task'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" style={{ animationDuration: '0.2s' }} onClick={onClose} />

      <div className="relative glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in" style={{ animationDuration: '0.3s' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-display">
            {editTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                value={form.title}
                onChange={set('title')}
                placeholder="e.g. Prepare client presentation"
                className={`input-premium flex-1 ${errors.title ? 'border-red-500/50 focus:border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiLoading}
                title="Generate with AI"
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-60 shadow-lg shadow-indigo-500/20"
              >
                {aiLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Sparkles className="w-4 h-4" />
                }
                AI
              </button>
            </div>
            {errors.title && <p className="text-xs text-red-400 mt-1.5">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={3}
              placeholder="Task description..."
              className="input-premium resize-none"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select value={form.priority} onChange={set('priority')} className="input-premium bg-black/40 text-gray-200 cursor-pointer">
                {PRIORITIES.map(p => <option key={p} value={p} className="bg-gray-900">{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select value={form.status} onChange={set('status')} className="input-premium bg-black/40 text-gray-200 cursor-pointer">
                {STATUSES.map(s => (
                  <option key={s} value={s} className="bg-gray-900">
                    {s === 'IN_PROGRESS' ? 'In Progress' : s === 'TODO' ? 'To Do' : 'Done'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={set('dueDate')}
              className="input-premium bg-black/40 text-gray-200 [color-scheme:dark]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary-premium flex-1 py-3">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-premium flex-1 py-3">
              {saving
                ? <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </span>
                : editTask ? 'Update Task' : 'Create Task'
              }
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
