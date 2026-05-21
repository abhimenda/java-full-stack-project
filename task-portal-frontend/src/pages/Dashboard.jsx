import { CheckSquare, Clock, ListTodo, BarChart3, Plus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../context/AuthContext'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import ConfirmModal from '../components/ConfirmModal'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const PIE_COLORS = ['#38bdf8', '#a855f7', '#10b981']

export default function Dashboard() {
  const { user } = useAuth()
  const { tasks, stats, loading, createTask, updateTask, updateStatus, deleteTask } = useTasks()
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

  const pieData = [
    { name: 'To Do', value: stats.todo || 0 },
    { name: 'In Progress', value: stats.inProgress || 0 },
    { name: 'Done', value: stats.done || 0 },
  ].filter(d => d.value > 0)

  const barData = [
    { name: 'To Do', count: stats.todo || 0, fill: '#38bdf8' },
    { name: 'In Progress', count: stats.inProgress || 0, fill: '#a855f7' },
    { name: 'Done', count: stats.done || 0, fill: '#10b981' },
  ]

  const recentTasks = tasks.slice(0, 3)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => { setEditTask(null); setModalOpen(true) }}
          className="btn-premium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Tasks" value={stats.total || 0} icon={BarChart3} color="text-indigo-400" bg="glass-panel border-white/5" />
        <StatsCard label="To Do" value={stats.todo || 0} icon={ListTodo} color="text-sky-400" bg="glass-panel border-white/5" />
        <StatsCard label="In Progress" value={stats.inProgress || 0} icon={Clock} color="text-purple-400" bg="glass-panel border-white/5" />
        <StatsCard label="Completed" value={stats.done || 0} icon={CheckSquare} color="text-emerald-400" bg="glass-panel border-white/5" />
      </div>

      {/* Charts */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6">
            <h3 className="font-semibold text-white mb-4">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {['To Do', 'In Progress', 'Done'].map((l, i) => (
                <div key={l} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  {l}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-semibold text-white mb-4">Status Overview</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="glass-panel">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="font-semibold text-white">Recent Tasks</h3>
          <Link to="/tasks" className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3 opacity-50">📋</p>
            <p className="text-gray-400 font-medium">No tasks yet</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-3 text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {recentTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        )}
      </div>

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
