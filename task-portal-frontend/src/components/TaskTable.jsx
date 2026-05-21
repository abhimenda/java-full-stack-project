import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'
import { format } from 'date-fns'
import { useState } from 'react'

export default function TaskTable({ tasks, onEdit, onDelete, onStatusChange }) {
  const [sortField, setSortField] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const sorted = [...tasks].sort((a, b) => {
    let av = a[sortField] ?? ''
    let bv = b[sortField] ?? ''
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 opacity-20" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-indigo-400" />
      : <ChevronDown className="w-3 h-3 text-indigo-400" />
  }

  const Th = ({ label, field }) => (
    <th
      onClick={() => toggleSort(field)}
      className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white select-none transition-colors border-b border-white/5"
    >
      <span className="flex items-center gap-1.5">{label} <SortIcon field={field} /></span>
    </th>
  )

  const statusCycle = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3 opacity-50">📭</p>
        <p className="font-medium text-white">No tasks found</p>
        <p className="text-sm mt-1">Create your first task to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-black/20 backdrop-blur-sm">
          <tr>
            <Th label="Title" field="title" />
            <Th label="Priority" field="priority" />
            <Th label="Status" field="status" />
            <Th label="Due Date" field="dueDate" />
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sorted.map(task => (
            <tr key={task.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onStatusChange(task.id, statusCycle[task.status])}
                  title="Click to advance status"
                  className="transition-transform hover:scale-105"
                >
                  <StatusBadge status={task.status} />
                </button>
              </td>
              <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-white/10 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
