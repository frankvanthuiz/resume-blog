import { getPostsByCategory, getAllCategories } from '@/lib/mdx'
import ArticleCard from '@/components/ArticleCard'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return getAllCategories().map(category => ({ category }))
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const posts = getPostsByCategory(category)
  if (posts.length === 0) notFound()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="text-accent text-xs uppercase tracking-widest mb-2">Category</p>
      <h1 className="text-3xl font-bold text-white mb-8 capitalize">
        {category.replace(/-/g, ' ')}
      </h1>
      <div className="grid grid-cols-1 gap-6" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'}}>
        {posts.map(post => <ArticleCard key={post.slug} post={post} />)}
      </div>
    </div>
  )
}
