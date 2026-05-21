import { Calendar, Pencil, Trash2 } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'
import { format } from 'date-fns'

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const statusCycle = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' }

  return (
    <div className="glass-panel p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white text-base leading-snug flex-1 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
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
      </div>

      {task.description && (
        <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <PriorityBadge priority={task.priority} />
        <button
          onClick={() => onStatusChange(task.id, statusCycle[task.status])}
          title="Click to advance status"
          className="transition-transform hover:scale-105"
        >
          <StatusBadge status={task.status} />
        </button>
      </div>

      {task.dueDate && (
        <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400 bg-white/5 self-start px-2 py-1 rounded-md border border-white/5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
        </div>
      )}
    </div>
  )
}
