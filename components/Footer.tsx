export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16 py-8 px-6 text-center text-muted text-sm">
      <p>
        © {new Date().getFullYear()} ResumePro ·{' '}
        <a
          href={process.env.NEXT_PUBLIC_ETSY_URL ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Shop Resume Templates on Etsy
        </a>
      </p>
    </footer>
  )
}
