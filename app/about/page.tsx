export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-6">About ResumePro</h1>
      <p className="text-subtle leading-relaxed mb-4">
        ResumePro publishes practical, research-backed resume advice for job seekers at every career stage.
        From entry-level graduates to seasoned executives, our guides help you land more interviews.
      </p>
      <p className="text-subtle leading-relaxed mb-8">
        We also offer professional resume templates on Etsy — ATS-optimized and ready to customize.
      </p>
      <a
        href={process.env.NEXT_PUBLIC_ETSY_URL ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-accent text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-500 transition-colors"
      >
        Browse Our Templates →
      </a>
    </div>
  )
}
