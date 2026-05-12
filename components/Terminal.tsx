'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { findCommand, parse, type Theme } from './commands'
import { formatPrompt } from './fs'
import { SlashMenu, filteredSlashCommands } from './SlashMenu'
import { CompletionsMenu } from './CompletionsMenu'
import { complete } from './complete'

type Entry = {
  id: number
  cwd: string
  input: string
  output: ReactNode | null
  hidePrompt?: boolean
}

const THEME_KEY = 'mtif-theme'

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(THEME_KEY)
  return stored === 'light' ? 'light' : 'dark'
}

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [cwd, setCwd] = useState<string>('/')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState<number | null>(null)
  const [theme, setThemeState] = useState<Theme>('dark')
  const [slashOpen, setSlashOpen] = useState(false)
  const [slashIndex, setSlashIndex] = useState(0)
  const [completions, setCompletions] = useState<{ name: string; isDir: boolean }[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hintDismissed, setHintDismissed] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const seededRef = useRef(false)
  const idRef = useRef(0)
  const promptId = useId()

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_KEY, t)
      document.documentElement.setAttribute('data-theme', t)
    }
  }, [])

  const navigate = useCallback((href: string) => {
    if (typeof window !== 'undefined') window.location.assign(href)
  }, [])

  const clear = useCallback(() => {
    setEntries([])
  }, [])

  const runLine = useCallback(
    (raw: string, options?: { skipHistory?: boolean }) => {
      const trimmed = raw.trim()
      if (!trimmed) return
      if (!options?.skipHistory) {
        setHistory((h) => (h[h.length - 1] === trimmed ? h : [...h, trimmed]).slice(-50))
      }
      setHistoryIdx(null)
      setError(null)
      if (!options?.skipHistory) {
        setHintDismissed(true)
      }
      const { name, args } = parse(trimmed)
      const cmd = findCommand(name)
      const entryCwd = cwd
      const entryId = ++idRef.current
      if (!cmd) {
        setEntries((e) => [
          ...e,
          {
            id: entryId,
            cwd: entryCwd,
            input: trimmed,
            output: (
              <p className="term-line term-line--err">
                command not found: {name} &mdash; try &apos;help&apos; or &apos;?&apos;
              </p>
            ),
          },
        ])
        return
      }
      const output = cmd.run(args, {
        cwd,
        setCwd,
        clear,
        setTheme,
        theme,
        navigate,
        history,
      })
      if (cmd.name === 'clear' || cmd.name === '/clear') return
      setEntries((e) => [
        ...e,
        { id: entryId, cwd: entryCwd, input: trimmed, output },
      ])
    },
    [cwd, clear, navigate, setTheme, theme, history],
  )

  // Initial theme + seeded scrollback (once).
  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true
    const initial = readTheme()
    setTheme(initial)
    runLine('whoami', { skipHistory: true })
    runLine('ls', { skipHistory: true })
  }, [runLine, setTheme])

  // Scroll to bottom on new entries.
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ block: 'end' })
  }, [entries.length])

  // Global '/' focus + slash menu open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      if (!typing && e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
        setInput('/')
        setSlashOpen(true)
        setSlashIndex(0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (slashOpen) {
      const list = filteredSlashCommands(input)
      const pick = list[slashIndex]
      if (pick) {
        setInput(pick.name + ' ')
        setSlashOpen(false)
        inputRef.current?.focus()
        return
      }
    }
    runLine(input)
    setInput('')
    setSlashOpen(false)
    setCompletions(null)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInput(v)
    if (error) setError(null)
    setCompletions(null)
    if (v.startsWith('/') && !v.includes(' ')) {
      setSlashOpen(true)
      setSlashIndex(0)
    } else {
      setSlashOpen(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '?' && input === '') {
      e.preventDefault()
      const helpCmd = findCommand('help')
      if (helpCmd) {
        const output = helpCmd.run([], {
          cwd,
          setCwd,
          clear,
          setTheme,
          theme,
          navigate,
        })
        const entryId = ++idRef.current
        setEntries((entries) => [
          ...entries,
          { id: entryId, cwd, input: '?', output },
        ])
        setHistory((h) => (h[h.length - 1] === '?' ? h : [...h, '?']).slice(-50))
        setHistoryIdx(null)
      }
      return
    }
    if (slashOpen) {
      const list = filteredSlashCommands(input)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSlashIndex((i) => (list.length === 0 ? 0 : (i + 1) % list.length))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSlashIndex((i) => (list.length === 0 ? 0 : (i - 1 + list.length) % list.length))
        return
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        const pick = list[slashIndex]
        if (pick) {
          setInput(pick.name + ' ')
          setSlashOpen(false)
        }
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setSlashOpen(false)
        return
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const el = inputRef.current
      const cursor = el?.selectionStart ?? input.length
      const result = complete(input, cursor, cwd)
      if (!result) return
      if (result.value !== input) {
        setInput(result.value)
        requestAnimationFrame(() => {
          const node = inputRef.current
          if (node) {
            node.selectionStart = result.cursor
            node.selectionEnd = result.cursor
          }
        })
      }
      if (result.listing && result.listing.length > 0) {
        setCompletions(result.listing)
      } else {
        setCompletions(null)
      }
      return
    }

    if (e.key === 'ArrowUp') {
      if (history.length === 0) return
      e.preventDefault()
      const next = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      if (history.length === 0 || historyIdx === null) return
      e.preventDefault()
      const next = historyIdx + 1
      if (next >= history.length) {
        setHistoryIdx(null)
        setInput('')
      } else {
        setHistoryIdx(next)
        setInput(history[next])
      }
    } else if (e.key === 'Escape') {
      setInput('')
      setError(null)
      setCompletions(null)
    }
  }

  const promptPath = useMemo(() => formatPrompt(cwd), [cwd])

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="term-shell">
      <main
        className="term-main"
        aria-live="polite"
        aria-atomic="false"
        id="term-output"
        onClick={(e) => {
          // Don't steal focus from links/buttons inside the scrollback.
          const t = e.target as HTMLElement
          if (t.tagName === 'A' || t.tagName === 'BUTTON') return
          if (window.getSelection()?.toString()) return
          focusInput()
        }}
      >
        <div className="term-scrollback">
          {entries.map((entry) => (
            <div className="term-entry" key={entry.id}>
              {!entry.hidePrompt && (
                <p className="term-entry-prompt">
                  <span className="term-brand-prompt">mtif</span>
                  <span className="term-brand-sep">:</span>
                  <span className="term-brand-path">{formatPrompt(entry.cwd)}</span>
                  <span className="term-brand-sep">$</span>
                  <span className="term-entry-input"> {entry.input}</span>
                </p>
              )}
              {entry.output && <div className="term-entry-output">{entry.output}</div>}
            </div>
          ))}
          <div ref={scrollEndRef} />
        </div>
      </main>

      <form className="term-prompt-wrap" onSubmit={onSubmit} role="search">
        {completions && !slashOpen && <CompletionsMenu items={completions} />}
        {slashOpen && (
          <SlashMenu
            query={input}
            index={slashIndex}
            onIndexChange={setSlashIndex}
            onPick={(cmd) => {
              setInput(cmd.name + ' ')
              setSlashOpen(false)
              focusInput()
            }}
          />
        )}
        <div className="term-prompt">
          <label htmlFor={promptId} className="term-prompt-label">
            <span className="term-brand-prompt">mtif</span>
            <span className="term-brand-sep">:</span>
            <span className="term-brand-path">{promptPath}</span>
            <span className="term-brand-sep">$</span>
          </label>
          <input
            id={promptId}
            ref={inputRef}
            className="term-prompt-input"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="type a command — try 'help', '?', or '/'"
            aria-describedby={error ? `${promptId}-err` : undefined}
            autoFocus
          />
          <span className="term-prompt-cursor" aria-hidden="true" />
        </div>
        {error && (
          <p id={`${promptId}-err`} role="alert" className="term-error">
            {error}
          </p>
        )}
      </form>

      {!hintDismissed && (
        <aside className="term-tip" role="note" aria-label="new user tip">
          <span className="term-tip-label">tip</span>
          <span className="term-tip-body">
            new here? try <kbd>ls</kbd>{' '}
            <span className="term-tip-gloss">(list)</span>, <kbd>cd&nbsp;portfolio</kbd>{' '}
            <span className="term-tip-gloss">(open folder)</span>, <kbd>cat&nbsp;about.md</kbd>{' '}
            <span className="term-tip-gloss">(read file)</span>
          </span>
          <button
            type="button"
            className="term-tip-close"
            aria-label="dismiss tip"
            onClick={() => {
              setHintDismissed(true)
              inputRef.current?.focus()
            }}
          >
            ×
          </button>
        </aside>
      )}
      <footer className="term-foot">
        <span>jerome fisher · management & technology · penn</span>
        <span className="term-foot-key">
          <kbd>/</kbd> slash menu &middot; <kbd>?</kbd> help &middot; theme:{' '}
          {theme}
        </span>
      </footer>
    </div>
  )
}
