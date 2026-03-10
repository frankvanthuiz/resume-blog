import { getAllPosts, getAllCategories } from '@/lib/mdx'
import ArticleCard from '@/components/ArticleCard'

export const metadata = {
  title: 'Blog',
  description: 'Resume tips, examples, and career advice to help you land more interviews.',
}

const PAGE_SIZE = 9

export default function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> | { page?: string } }) {
  // searchParams may be a promise in Next.js 15+, handle both
  const params = searchParams as { page?: string }
  const allPosts = getAllPosts()
  const categories = getAllCategories()
  const page = Math.max(1, parseInt(params?.page ?? '1', 10))
  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE)
  const posts = allPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">All Articles</h1>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <a href="/blog" className="bg-accent text-white text-xs px-3 py-1 rounded-full">All</a>
        {categories.map(cat => (
          <a
            key={cat}
            href={`/blog/category/${cat}`}
            className="bg-surface border border-border text-subtle text-xs px-3 py-1 rounded-full hover:border-accent hover:text-accent transition-colors"
          >
            {cat.replace(/-/g, ' ')}
          </a>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-muted">No articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'}}>
          {posts.map(post => <ArticleCard key={post.slug} post={post} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {page > 1 && (
            <a href={`/blog?page=${page - 1}`} className="bg-surface border border-border text-subtle px-4 py-2 rounded hover:border-accent hover:text-accent transition-colors text-sm">
              ← Previous
            </a>
          )}
          <span className="text-muted text-sm px-4 py-2">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <a href={`/blog?page=${page + 1}`} className="bg-surface border border-border text-subtle px-4 py-2 rounded hover:border-accent hover:text-accent transition-colors text-sm">
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
