'use client'

type Item = { name: string; isDir: boolean }

export function CompletionsMenu({ items }: { items: Item[] }) {
  if (items.length === 0) return null
  return (
    <div
      className="term-completions"
      role="listbox"
      aria-label="Completions"
      aria-live="polite"
    >
      <div className="term-ls">
        {items.map((it) => (
          <span
            key={it.name}
            role="option"
            aria-selected={false}
            className={it.isDir ? 'term-ls-dir' : 'term-ls-file'}
          >
            {it.isDir ? `${it.name}/` : it.name}
          </span>
        ))}
      </div>
    </div>
  )
}
