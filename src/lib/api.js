import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'

const api = axios.create({ baseURL })

// if token exists from previous session, attach it
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// optional: response interceptor to auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // token invalid or expired — clear it
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      // you may also dispatch logout, but we keep api file free of redux
    }
    return Promise.reject(err)
  }
)

export default api
