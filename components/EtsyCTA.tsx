interface EtsyCTAProps {
  variant?: 'mid' | 'end'
}

export default function EtsyCTA({ variant = 'mid' }: EtsyCTAProps) {
  const etsy = process.env.NEXT_PUBLIC_ETSY_URL ?? '#'

  if (variant === 'end') {
    return (
      <div className="bg-teal-700 rounded-xl p-6 text-center my-8">
        <p className="text-white font-bold text-lg mb-1">Ready to land more interviews?</p>
        <p className="text-teal-200 text-sm mb-4">
          Download our ATS-optimized resume templates — used by thousands of job seekers.
        </p>
        <a
          href={etsy}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-teal-700 font-bold px-6 py-2 rounded hover:bg-teal-50 transition-colors"
        >
          View on Etsy →
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-xl p-5 text-center my-8 border border-indigo-700" style={{background: 'linear-gradient(135deg, #312e81, #1e1b4b)'}}>
      <p className="text-indigo-200 text-sm mb-1">💼 Skip the guesswork — use a proven template</p>
      <p className="text-white font-bold mb-3">Professional Resume Templates on Etsy</p>
      <a
        href={etsy}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-accent text-white font-bold px-6 py-2 rounded hover:bg-indigo-500 transition-colors"
      >
        Shop Templates →
      </a>
    </div>
  )
}
