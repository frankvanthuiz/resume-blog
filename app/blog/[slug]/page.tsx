import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllSlugs, getPostBySlug, getPostsByCategory } from '@/lib/mdx'
import { generateArticleMetadata } from '@/lib/seo'
import EtsyCTA from '@/components/EtsyCTA'
import TableOfContents from '@/components/TableOfContents'
import RelatedArticles from '@/components/RelatedArticles'

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return generateArticleMetadata(post)
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getPostsByCategory(post.category)
    .filter(p => p.slug !== post.slug)
    .slice(0, 3)

  // Split content at midpoint for mid-article CTA
  const lines = post.content.split('\n')
  const mid = Math.floor(lines.length / 2)
  const topContent = lines.slice(0, mid).join('\n')
  const bottomContent = lines.slice(mid).join('\n')

  return (
    <article className="max-w-2xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-4">
        <a href="/" className="hover:text-accent">Home</a>
        {' → '}
        <a href="/blog" className="hover:text-accent">Blog</a>
        {' → '}
        <span className="text-subtle">{post.title}</span>
      </nav>

      {/* Category badge */}
      <span className="inline-block text-accent text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-3" style={{background: '#1e3055'}}>
        {post.category.replace(/-/g, ' ')}
      </span>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white leading-tight mb-3">{post.title}</h1>

      {/* Meta */}
      <p className="text-muted text-sm mb-6">
        {post.readingTime} min read · {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        {' · '}
        <span className="text-accent">{post.tags.join(', ')}</span>
      </p>

      {/* TOC */}
      <TableOfContents content={post.content} />

      {/* Top half */}
      <div className="prose prose-invert prose-indigo max-w-none">
        <MDXRemote source={topContent} />
      </div>

      {/* Mid CTA */}
      <EtsyCTA variant="mid" />

      {/* Bottom half */}
      <div className="prose prose-invert prose-indigo max-w-none">
        <MDXRemote source={bottomContent} />
      </div>

      {/* End CTA */}
      <EtsyCTA variant="end" />

      {/* Related articles */}
      <RelatedArticles posts={related} />
    </article>
  )
}
