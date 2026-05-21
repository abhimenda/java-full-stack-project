import { useState, useEffect, useCallback } from 'react'
import { taskService } from '../services/taskService'
import toast from 'react-hot-toast'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const [taskData, statsData] = await Promise.all([
        taskService.getAll(search || undefined),
        taskService.getStats(),
      ])
      setTasks(taskData)
      setStats(statsData)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (data) => {
    const task = await taskService.create(data)
    setTasks(prev => [task, ...prev])
    setStats(prev => ({ ...prev, total: prev.total + 1, todo: prev.todo + 1 }))
    return task
  }

  const updateTask = async (id, data) => {
    const updated = await taskService.update(id, data)
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)))
    await fetchTasks()
    return updated
  }

  const updateStatus = async (id, status) => {
    const updated = await taskService.updateStatus(id, status)
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)))
    await fetchTasks()
    return updated
  }

  const deleteTask = async (id) => {
    await taskService.delete(id)
    setTasks(prev => prev.filter(t => t.id !== id))
    await fetchTasks()
  }

  return { tasks, stats, loading, search, setSearch, createTask, updateTask, updateStatus, deleteTask, refetch: fetchTasks }
}
