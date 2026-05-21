import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { Zap, Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const InputField = ({ label, type = 'text', value, onChange, placeholder, error, right }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-premium ${right ? 'pr-10' : ''} ${error ? 'border-red-500/50 focus:border-red-500' : ''}`}
      />
      {right}
    </div>
    {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
  </div>
)

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First Name is required'
    else if (form.firstName.length < 2) errs.firstName = 'Min 2 characters'
    if (!form.lastName.trim()) errs.lastName = 'Last Name is required'
    else if (form.lastName.length < 2) errs.lastName = 'Min 2 characters'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Min 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      const data = await authService.register(payload)
      login(data)
      toast.success(`Account created! Welcome, ${data.firstName}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md animate-fade-in relative z-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-500/20 mb-4 transform hover:scale-105 transition-transform">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white font-display tracking-tight">Create account</h1>
          <p className="text-gray-400 mt-2 text-sm">Start managing tasks with AI superpowers</p>
        </div>

        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="First Name" value={form.firstName} onChange={set('firstName')} error={errors.firstName} placeholder="John" />
              <InputField label="Last Name" value={form.lastName} onChange={set('lastName')} error={errors.lastName} placeholder="Doe" />
            </div>
            <InputField label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min 6 characters"
                  className={`input-premium pr-10 ${errors.password ? 'border-red-500/50 focus:border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Re-enter password"
                className={`input-premium ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : ''}`}
              />
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1.5">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-3 mt-6"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
