const PRIORITY_STYLES = {
  LOW:    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20',
  MEDIUM: 'bg-amber-500/20 text-amber-300 border border-amber-500/20',
  HIGH:   'bg-orange-500/20 text-orange-300 border border-orange-500/20',
  URGENT: 'bg-rose-500/20 text-rose-300 border border-rose-500/20',
}

export default function PriorityBadge({ priority }) {
  return (
    <span className={`badge-premium ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.MEDIUM}`}>
      {priority}
    </span>
  )
}
