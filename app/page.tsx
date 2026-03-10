import { getAllPosts } from '@/lib/mdx'
import ArticleCard from '@/components/ArticleCard'

export default function Home() {
  const posts = getAllPosts().slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="px-6 py-20 text-center" style={{background: 'linear-gradient(135deg, #1e1b4b, #0f172a)'}}>
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          Write a Resume That Gets <span className="text-accent">Interviews</span>
        </h1>
        <p className="text-subtle text-lg max-w-xl mx-auto mb-8">
          Expert tips, examples, and templates for every career stage.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_ETSY_URL ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-500 transition-colors text-lg"
        >
          Shop Resume Templates →
        </a>
      </section>

      {/* Latest articles */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Latest Articles</h2>
        {posts.length === 0 ? (
          <p className="text-muted">No articles yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'}}>
            {posts.map(post => <ArticleCard key={post.slug} post={post} />)}
          </div>
        )}
        <div className="text-center mt-10">
          <a href="/blog" className="text-accent hover:underline text-sm">View all articles →</a>
        </div>
      </section>

      {/* Bottom Etsy banner */}
      <section className="bg-teal-800 py-12 px-6 text-center">
        <h2 className="text-white font-bold text-2xl mb-2">Ready to stand out?</h2>
        <p className="text-teal-200 mb-6">Professional, ATS-optimized resume templates available now.</p>
        <a
          href={process.env.NEXT_PUBLIC_ETSY_URL ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-teal-800 font-bold px-8 py-3 rounded-lg hover:bg-teal-50 transition-colors"
        >
          Browse Templates on Etsy →
        </a>
      </section>
    </div>
  )
}
