'use client'

import { useEffect, useMemo } from 'react'
import { SLASH_COMMANDS, type Command } from './commands'

type Props = {
  query: string
  index: number
  onIndexChange: (i: number) => void
  onPick: (cmd: Command) => void
}

export function SlashMenu({ query, index, onIndexChange, onPick }: Props) {
  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return SLASH_COMMANDS.filter((c) => c.name.toLowerCase().startsWith(q))
  }, [query])

  useEffect(() => {
    if (index >= filtered.length && filtered.length > 0) onIndexChange(0)
  }, [filtered.length, index, onIndexChange])

  if (filtered.length === 0) return null

  return (
    <div className="term-slashmenu" role="listbox" aria-label="Slash commands">
      {filtered.map((cmd, i) => (
        <button
          type="button"
          key={cmd.name}
          role="option"
          aria-selected={i === index}
          className={`term-slashmenu-item${i === index ? ' term-slashmenu-item--active' : ''}`}
          onMouseEnter={() => onIndexChange(i)}
          onMouseDown={(e) => {
            e.preventDefault()
            onPick(cmd)
          }}
        >
          <span className="term-slashmenu-name">{cmd.name}</span>
          {cmd.usage && cmd.usage !== cmd.name && (
            <span className="term-slashmenu-usage">
              {cmd.usage.slice(cmd.name.length).trim()}
            </span>
          )}
          <span className="term-slashmenu-hint">{cmd.summary}</span>
        </button>
      ))}
    </div>
  )
}

export function filteredSlashCommands(query: string): Command[] {
  const q = query.toLowerCase()
  return SLASH_COMMANDS.filter((c) => c.name.toLowerCase().startsWith(q))
}
