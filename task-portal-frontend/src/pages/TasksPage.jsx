import { useState, useEffect } from 'react'
import { Plus, Search, LayoutGrid, Table2, Loader2, CheckSquare } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TaskModal from '../components/TaskModal'
import TaskCard from '../components/TaskCard'
import TaskTable from '../components/TaskTable'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const STATUS_FILTERS = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE']
const PRIORITY_FILTERS = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']

export default function TasksPage() {
  const { tasks, loading, search, setSearch, createTask, updateTask, updateStatus, deleteTask } = useTasks()
  const [view, setView] = useState('grid') // 'grid' | 'table'
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [deleteTaskId, setDeleteTaskId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const handleOpen = () => {
      setEditTask(null)
      setModalOpen(true)
    }
    window.addEventListener('openNewTaskModal', handleOpen)
    return () => window.removeEventListener('openNewTaskModal', handleOpen)
  }, [])

  const filtered = tasks.filter(t => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false
    return true
  })

  const handleEdit = (task) => { setEditTask(task); setModalOpen(true) }

  const handleDelete = (id) => setDeleteTaskId(id)

  const confirmDelete = async () => {
    if (!deleteTaskId) return
    setIsDeleting(true)
    try { 
      await deleteTask(deleteTaskId)
      toast.success('Task deleted successfully!')
      setDeleteTaskId(null)
    } catch { 
      toast.error('Failed to delete task') 
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = async (data) => {
    if (editTask) {
      await updateTask(editTask.id, data)
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-fade-in' : 'opacity-0'} w-full max-w-sm bg-[#121216] border border-white/10 shadow-2xl rounded-2xl pointer-events-auto flex p-4`}>
          <div className="flex items-start gap-3 w-full">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Task Updated Successfully</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{data.title}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300 font-medium">
                  {data.status.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300 font-medium">
                  {data.priority}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))
    } else {
      await createTask(data)
      toast.success('Task created successfully!')
    }
    setEditTask(null)
    setModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Tasks</h1>
          <p className="text-sm text-gray-400 mt-1">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setEditTask(null); setModalOpen(true) }}
          className="btn-premium flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> New Task
        </button>
      </div>

      {/* Filters bar */}
      <div className="glass-panel p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="input-premium pl-10"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === s
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {s === 'IN_PROGRESS' ? 'In Progress' : s === 'TODO' ? 'To Do' : s}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="input-premium w-auto text-sm bg-black/40 text-gray-200 cursor-pointer"
          >
            {PRIORITY_FILTERS.map(p => (
              <option key={p} value={p} className="bg-gray-900">{p === 'ALL' ? 'All Priorities' : p}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${view === 'grid' ? 'bg-white/10 shadow-sm text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-2 rounded-md transition-all duration-200 ${view === 'table' ? 'bg-white/10 shadow-sm text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400 glass-panel">
              <p className="text-4xl mb-3 opacity-50">📭</p>
              <p className="font-medium text-gray-300">No tasks match your filters</p>
            </div>
          ) : filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={updateStatus}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <TaskTable
            tasks={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={updateStatus}
          />
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null) }}
        onSave={handleSave}
        editTask={editTask}
      />

      <ConfirmModal
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  )
}
