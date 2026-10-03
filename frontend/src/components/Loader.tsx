type LoaderProps = {
  size?: number
  label?: string
  fullPage?: boolean
}

export default function Loader({
  size = 40,
  label = 'Loading...',
  fullPage = false,
}: LoaderProps) {
  const spinner = (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className="animate-spin text-teal-700 motion-reduce:animate-none"
        aria-hidden="true"
      >
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.2" />
        <path
          d="M25 5a20 20 0 0 1 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  )

  if (!fullPage) return spinner

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/80 backdrop-blur-sm">
      {spinner}
    </div>
  )
}