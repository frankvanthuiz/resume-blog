import Link from 'next/link'
import type { PostMeta } from '@/lib/mdx'

export default function RelatedArticles({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null
  return (
    <div className="mt-12 border-t border-border pt-10">
      <h2 className="text-lg font-bold text-white mb-4">Related Articles</h2>
      <div className="flex flex-col gap-3">
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-start gap-3 group"
          >
            <span className="text-accent mt-1">→</span>
            <span className="text-subtle group-hover:text-white transition-colors text-sm">
              {post.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
