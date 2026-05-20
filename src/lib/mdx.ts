import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentRoot = path.join(process.cwd(), 'content')

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  category: string
  coverEmoji?: string
  github?: string
  stars?: number
  rating?: string
}

export interface Article extends ArticleMeta {
  content: string
}

export function getArticles(category: string): ArticleMeta[] {
  const dir = path.join(contentRoot, category)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, '')
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        summary: data.summary ?? '',
        tags: data.tags ?? [],
        category,
        coverEmoji: data.coverEmoji,
        github: data.github,
        stars: data.stars,
        rating: data.rating,
      } as ArticleMeta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getArticle(category: string, slug: string): Article | null {
  const filePath = path.join(contentRoot, category, `${slug}.mdx`)
  const fallback = path.join(contentRoot, category, `${slug}.md`)
  const target = fs.existsSync(filePath) ? filePath : fs.existsSync(fallback) ? fallback : null
  if (!target) return null

  const raw = fs.readFileSync(target, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    content,
    title: data.title ?? slug,
    date: data.date ?? '',
    summary: data.summary ?? '',
    tags: data.tags ?? [],
    category,
    coverEmoji: data.coverEmoji,
    github: data.github,
    stars: data.stars,
    rating: data.rating,
  }
}

export function getAllArticles(): ArticleMeta[] {
  const categories = ['project-learning', 'aicoding', 'others-stones']
  return categories.flatMap(getArticles).sort((a, b) => (a.date < b.date ? 1 : -1))
}
