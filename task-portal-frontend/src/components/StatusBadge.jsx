const STATUS_STYLES = {
  TODO:        'bg-white/10 text-gray-300 border border-white/10',
  IN_PROGRESS: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20',
  DONE:        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20',
}

const STATUS_LABELS = {
  TODO:        'To Do',
  IN_PROGRESS: 'In Progress',
  DONE:        'Done',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`badge-premium ${STATUS_STYLES[status] || STATUS_STYLES.TODO}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
