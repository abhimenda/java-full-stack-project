import { Menu, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="h-16 glass-panel flex items-center justify-between px-4 md:px-8 flex-shrink-0 mx-4 md:mx-8 mt-4 z-20 sticky top-4">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/10"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden md:block">
        <h2 className="text-sm text-gray-400">
          Welcome back, <span className="font-semibold text-white">{user?.firstName}</span>
        </h2>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="text-sm font-medium text-gray-200 hidden sm:block">{user?.firstName} {user?.lastName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  )
}
