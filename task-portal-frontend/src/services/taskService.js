import api from './api'

export const taskService = {
  getAll: (search) => {
    const params = search ? { search } : {}
    return api.get('/tasks', { params }).then(r => r.data)
  },
  getStats: () => api.get('/tasks/stats').then(r => r.data),
  getById: (id) => api.get(`/tasks/${id}`).then(r => r.data),
  create: (data) => api.post('/tasks', data).then(r => r.data),
  update: (id, data) => api.put(`/tasks/${id}`, data).then(r => r.data),
  updateStatus: (id, status) =>
    api.patch(`/tasks/${id}/status`, null, { params: { status } }).then(r => r.data),
  delete: (id) => api.delete(`/tasks/${id}`),
  generateWithAi: (title) =>
    api.post('/ai/generate', { title }).then(r => r.data),
}
