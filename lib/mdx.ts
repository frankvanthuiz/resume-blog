import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  title: string
  description: string
  slug: string
  date: string
  category: string
  tags: string[]
  readingTime: number
}

export interface Post extends PostMeta {
  content: string
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'))
  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')
      const { data } = matter(raw)
      return data as PostMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { ...(data as PostMeta), content }
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter(p => p.category === category)
}

export function getAllCategories(): string[] {
  return [...new Set(getAllPosts().map(p => p.category))]
}

export function getAllSlugs(): string[] {
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
}
