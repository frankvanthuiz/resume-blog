interface TOCItem { id: string; text: string }

function extractHeadings(content: string): TOCItem[] {
  const matches = [...content.matchAll(/^## (.+)$/gm)]
  return matches.map(m => ({
    id: m[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    text: m[1],
  }))
}

export default function TableOfContents({ content }: { content: string }) {
  const items = extractHeadings(content)
  if (items.length === 0) return null
  return (
    <div className="bg-surface rounded-lg p-4 my-6 border border-border">
      <p className="text-xs uppercase tracking-widest text-muted mb-3">Table of Contents</p>
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-accent text-sm hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
