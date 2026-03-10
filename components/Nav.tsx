import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="bg-accent px-6 py-3 flex items-center gap-8">
      <Link href="/" className="text-white font-bold tracking-widest text-sm">
        RESUMEPRO
      </Link>
      <div className="ml-auto flex gap-6 text-indigo-200 text-sm">
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <Link href="/about" className="hover:text-white transition-colors">About</Link>
        <a
          href={process.env.NEXT_PUBLIC_ETSY_URL ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-accent px-4 py-1 rounded font-semibold hover:bg-indigo-50 transition-colors"
        >
          Shop Templates
        </a>
      </div>
    </nav>
  )
}
