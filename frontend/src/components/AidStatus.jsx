export default function AidStatus({ value }) {
  const given = value === 'Given'

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${given ? 'text-emerald-700' : 'text-amber-700'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${given ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
      {value}
    </span>
  )
}
