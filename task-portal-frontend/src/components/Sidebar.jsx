import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, X, Zap, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get first letter for avatar
  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-[#0a0a0b] md:rounded-none md:border-y-0 md:border-l-0 border-r border-white/5 flex flex-col h-full
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-[0.4rem] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-white text-xl font-display tracking-wide">
              Task<span className="text-indigo-500">Portal</span>
            </span>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        {user && (
          <div className="px-5 py-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                    {initial}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0b]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user.firstName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden px-3 py-6 custom-scrollbar">
          
          {/* Main Menu */}
          <div className="mt-4">
            <p className="px-4 text-xs font-semibold text-gray-500 tracking-wider mb-3">MAIN MENU</p>
            <nav className="space-y-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-500/10 text-white border-l-4 border-indigo-500 rounded-r-lg'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 rounded-lg border-l-4 border-transparent'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* AI Tools */}
          <div className="mt-auto pt-8">
            <p className="px-4 text-xs font-semibold text-gray-500 tracking-wider mb-3">AI TOOLS</p>
            <div className="px-2">
              <div 
                onClick={() => {
                  navigate('/dashboard')
                  setTimeout(() => window.dispatchEvent(new CustomEvent('openNewTaskModal')), 50)
                  if (onClose) onClose()
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#2a2245] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">AI Assistant</p>
                    <p className="text-xs text-gray-400 mt-0.5">Get help with your tasks</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>
          </div>

        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
