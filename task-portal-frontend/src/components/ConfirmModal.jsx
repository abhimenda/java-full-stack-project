import { createPortal } from 'react-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isLoading }) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" style={{ animationDuration: '0.2s' }} onClick={onClose} />
      
      <div className="relative bg-[#121216] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl animate-fade-in" style={{ animationDuration: '0.3s' }}>
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 font-display">{title}</h3>
        <p className="text-sm text-gray-400 mb-8">{message}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            disabled={isLoading} 
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isLoading} 
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
