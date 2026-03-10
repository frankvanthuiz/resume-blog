import Link from 'next/link'
import type { PostMeta } from '@/lib/mdx'

export default function ArticleCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block bg-surface border border-border rounded-xl p-5 hover:border-accent transition-colors group">
      <span className="text-xs uppercase tracking-widest text-accent mb-2 block">
        {post.category.replace(/-/g, ' ')}
      </span>
      <h3 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-accent-light transition-colors">
        {post.title}
      </h3>
      <p className="text-subtle text-sm line-clamp-2 mb-3">{post.description}</p>
      <p className="text-muted text-xs">
        {post.readingTime} min read · {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </Link>
  )
}
