import type { Metadata } from 'next'
import type { PostMeta } from './mdx'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://resumepro.example.com'
const SITE_NAME = 'ResumePro'

export function generateArticleMetadata(post: PostMeta): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`
  // JSON-LD is entirely server-generated structured data — no user input
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    keywords: post.tags.join(', '),
  })
  return {
    title: post.title,
    description: post.description,
    other: { 'application/ld+json': jsonLd },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      siteName: SITE_NAME,
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: url },
  }
}
