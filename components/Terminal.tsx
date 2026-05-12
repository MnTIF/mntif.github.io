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

type TourStep = {
  note: ReactNode
  command?: string
}

type GuideOption = {
  label: string
  hint: string
  commands: string[]
}

const THEME_KEY = 'mtif-theme'
const TOUR_TYPE_DELAY_MS = 62
const TOUR_NOTE_PAUSE_MS = 360
const TOUR_COMMAND_PAUSE_MS = 420

const TOUR_STEPS: TourStep[] = [
  {
    note: (
      <p className="term-para">
        This site works like a tiny Linux-style filesystem. The prompt shows
        where you are, and commands let you move around.
      </p>
    ),
  },
  {
    note: (
      <p className="term-para term-para--dim">
        <span className="term-cmdname">ls</span> lists the files and directories
        in your current directory.
      </p>
    ),
    command: 'ls',
  },
  {
    note: (
      <p className="term-para term-para--dim">
        <span className="term-cmdname">cat</span>, short for concatenate, prints
        a file&apos;s contents in the terminal.
      </p>
    ),
    command: 'cat about.md',
  },
  {
    note: (
      <p className="term-para term-para--dim">
        <span className="term-cmdname">cd</span>, short for change directory,
        moves into a directory.
      </p>
    ),
    command: 'cd team',
  },
  {
    note: (
      <p className="term-para term-para--dim">
        Now that we are in <span className="term-cmdname">team</span>, list who
        is here.
      </p>
    ),
    command: 'ls',
  },
  {
    note: <p className="term-para term-para--dim">Read Karthik&apos;s file.</p>,
    command: 'cat karthik-kaligotla.md',
  },
  {
    note: <p className="term-para term-para--dim">Read Vivasvat&apos;s file too.</p>,
    command: 'cat vivasvat-rastogi.md',
  },
  {
    note: (
      <p className="term-para term-para--dim">
        <span className="term-cmdname">..</span> means the parent directory, so{' '}
        <span className="term-cmdname">cd ..</span> moves back up one level.
      </p>
    ),
    command: 'cd ..',
  },
  {
    note: (
      <p className="term-para">
        That is the core loop: <span className="term-cmdname">ls</span> to look,{' '}
        <span className="term-cmdname">cd</span> to move, and{' '}
        <span className="term-cmdname">cat</span> to read. We also added a few
        extra commands just for fun, because we like going above and beyond.
        Type <span className="term-cmdname">?</span> later to see everything.
      </p>
    ),
    command: 'figlet hello from mtif',
  },
]

const GUIDE_OPTIONS: GuideOption[] = [
  { label: 'About the fund', hint: 'read about.md', commands: ['cat /about.md'] },
  { label: 'Team', hint: 'list team files', commands: ['ls /team'] },
  {
    label: 'Co-presidents',
    hint: 'view Karthik and Vivasvat',
    commands: ['cat /team/karthik-kaligotla.md', 'cat /team/vivasvat-rastogi.md'],
  },
  { label: 'Portfolio', hint: 'list portfolio years', commands: ['ls /portfolio'] },
  { label: 'Apply', hint: 'read application info', commands: ['cat /apply.md'] },
  { label: 'Contact', hint: 'read contact.md', commands: ['cat /contact.md'] },
  { label: 'Blog', hint: 'open blog page', commands: ['/blog'] },
  { label: 'Teach me the terminal', hint: 'start tour', commands: ['tour'] },
]

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
  const [tourStep, setTourStep] = useState<number | null>(null)
  const [tourBusy, setTourBusy] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [guideIndex, setGuideIndex] = useState(0)
  const [companionDismissed, setCompanionDismissed] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const lastEntryRef = useRef<HTMLDivElement>(null)
  const nextScrollModeRef = useRef<'bottom' | 'entry-start'>('bottom')
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

  const addSystemEntry = useCallback(
    (output: ReactNode) => {
      const entryId = ++idRef.current
      setEntries((e) => [
        ...e,
        { id: entryId, cwd, input: '', output, hidePrompt: true },
      ])
    },
    [cwd],
  )

  const dismissCompanion = useCallback(() => {
    setCompanionDismissed(true)
  }, [])

  const startTour = useCallback(() => {
    setTourStep(0)
    setTourBusy(false)
    setGuideOpen(false)
    setCompletions(null)
    setSlashOpen(false)
    setHintDismissed(true)
    dismissCompanion()
    inputRef.current?.focus()
  }, [dismissCompanion])

  const openGuide = useCallback(() => {
    setGuideOpen(true)
    setGuideIndex(0)
    setTourStep(null)
    setCompletions(null)
    setSlashOpen(false)
    setHintDismissed(true)
    dismissCompanion()
    inputRef.current?.focus()
  }, [dismissCompanion])

  const runLine = useCallback(
    (raw: string, options?: { skipHistory?: boolean }) => {
      const trimmed = raw.trim()
      if (!trimmed) return
      if (!options?.skipHistory) {
        setHistory((h) => (h[h.length - 1] === trimmed ? h : [...h, trimmed]).slice(-50))
      }
      setHistoryIdx(null)
      setError(null)
      if (!options?.skipHistory) setHintDismissed(true)

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
                command not found: {name} - try &apos;guide&apos;, &apos;tour&apos;, or &apos;help&apos;
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
        startTour,
        openGuide,
      })

      if (cmd.name === 'clear' || cmd.name === '/clear') return
      setEntries((e) => [...e, { id: entryId, cwd: entryCwd, input: trimmed, output }])
    },
    [clear, cwd, history, navigate, openGuide, setTheme, startTour, theme],
  )

  const runTourCommand = useCallback(
    (command: string) => {
      const typeAndRun = async () => {
        setTourBusy(true)
        setInput('')
        if (reducedMotion) {
          setInput(command)
        } else {
          for (let i = 1; i <= command.length; i++) {
            setInput(command.slice(0, i))
            await new Promise((resolve) => window.setTimeout(resolve, TOUR_TYPE_DELAY_MS))
          }
          await new Promise((resolve) => window.setTimeout(resolve, TOUR_COMMAND_PAUSE_MS))
        }
        nextScrollModeRef.current = 'entry-start'
        runLine(command, { skipHistory: true })
        setInput('')
        setTourBusy(false)
        setTourStep((step) => (step === null ? null : Math.min(step + 1, TOUR_STEPS.length)))
      }
      void typeAndRun()
    },
    [reducedMotion, runLine],
  )

  const advanceTour = useCallback(() => {
    if (tourStep === null || tourBusy) return
    if (tourStep >= TOUR_STEPS.length) {
      setTourStep(null)
      setInput('')
      inputRef.current?.focus()
      return
    }

    const step = TOUR_STEPS[tourStep]
    setTourBusy(true)
    addSystemEntry(
      <div className="term-output term-tour-note">
        <p className="term-line term-line--dim">tour {tourStep + 1}/{TOUR_STEPS.length}</p>
        {step.note}
      </div>,
    )

    if (tourStep === 0 && cwd !== '/') {
      window.setTimeout(() => runTourCommand('cd ~'), reducedMotion ? 0 : TOUR_NOTE_PAUSE_MS)
      return
    }
    if (step.command) {
      window.setTimeout(() => runTourCommand(step.command!), reducedMotion ? 0 : TOUR_NOTE_PAUSE_MS)
      return
    }
    setTourBusy(false)
    setTourStep((stepIdx) => (stepIdx === null ? null : Math.min(stepIdx + 1, TOUR_STEPS.length)))
  }, [addSystemEntry, cwd, reducedMotion, runTourCommand, tourBusy, tourStep])

  const selectGuideOption = useCallback(
    (index: number) => {
      const option = GUIDE_OPTIONS[index]
      if (!option) return
      setGuideOpen(false)
      setInput('')
      for (const command of option.commands) runLine(command)
    },
    [runLine],
  )

  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true
    const initial = readTheme()
    setTheme(initial)
    setCompanionDismissed(false)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    runLine('whoami', { skipHistory: true })
    runLine('ls', { skipHistory: true })
  }, [runLine, setTheme])

  useEffect(() => {
    if (tourStep === 0 && !tourBusy) advanceTour()
  }, [advanceTour, tourBusy, tourStep])

  useEffect(() => {
    const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth'

    if (!companionDismissed && entries.length <= 2) {
      requestAnimationFrame(() => {
        mainRef.current?.scrollTo({ top: 0, behavior: 'auto' })
      })
      return
    }

    if (nextScrollModeRef.current === 'entry-start') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const main = mainRef.current
          const entry = lastEntryRef.current
          if (!main || !entry) return

          const isTallOutput = entry.offsetHeight > main.clientHeight * 0.58
          if (isTallOutput) {
            main.scrollTo({
              top: Math.max(0, entry.offsetTop - main.offsetTop),
              behavior,
            })
          } else {
            main.scrollTo({ top: main.scrollHeight, behavior })
          }
          nextScrollModeRef.current = 'bottom'
        })
      })
      return
    }

    requestAnimationFrame(() => {
      const main = mainRef.current
      if (main) main.scrollTo({ top: main.scrollHeight, behavior })
    })
  }, [companionDismissed, entries.length, reducedMotion])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      if (!typing && e.key === '/' && tourStep === null) {
        e.preventDefault()
        inputRef.current?.focus()
        setInput('/')
        setSlashOpen(true)
        setGuideOpen(false)
        setSlashIndex(0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tourStep])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tourStep !== null) {
      advanceTour()
      return
    }
    if (guideOpen) {
      selectGuideOption(guideIndex)
      return
    }
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
    if (tourStep !== null) return
    const v = e.target.value
    setInput(v)
    if (error) setError(null)
    setCompletions(null)
    if (v.startsWith('/') && !v.includes(' ')) {
      setSlashOpen(true)
      setGuideOpen(false)
      setSlashIndex(0)
    } else {
      setSlashOpen(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tourStep !== null) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setTourStep(null)
        setTourBusy(false)
        setInput('')
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault()
        advanceTour()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setTourStep((step) => (step === null ? null : Math.max(0, step - 1)))
      } else {
        e.preventDefault()
      }
      return
    }

    if (guideOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setGuideIndex((i) => (i + 1) % GUIDE_OPTIONS.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setGuideIndex((i) => (i - 1 + GUIDE_OPTIONS.length) % GUIDE_OPTIONS.length)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        selectGuideOption(guideIndex)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setGuideOpen(false)
        return
      }
    }

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
          history,
          startTour,
          openGuide,
        })
        const entryId = ++idRef.current
        setEntries((entries) => [...entries, { id: entryId, cwd, input: '?', output }])
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
      setGuideOpen(false)
    }
  }

  const promptPath = useMemo(() => formatPrompt(cwd), [cwd])

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <div className={`term-shell${tourStep !== null ? ' term-shell--tour' : ''}`}>
      <main
        ref={mainRef}
        className="term-main"
        aria-live="polite"
        aria-atomic="false"
        id="term-output"
        onClick={(e) => {
          const t = e.target as HTMLElement
          if (t.tagName === 'A' || t.tagName === 'BUTTON') return
          if (window.getSelection()?.toString()) return
          focusInput()
        }}
      >
        <div className="term-scrollback">
          {!companionDismissed && (
            <aside className="term-companion" role="note" aria-label="new user shortcuts">
              <div className="term-companion-sprite term-companion-sprite--robot" aria-hidden="true">
                <span className="term-robot-antenna" />
                <span className="term-robot-head">
                  <span className="term-robot-eye term-robot-eye--left" />
                  <span className="term-robot-eye term-robot-eye--right" />
                  <span className="term-robot-mouth" />
                </span>
              </div>
              <div className="term-companion-copy">
                <p>new here?</p>
                <p>
                  type <kbd>tour</kbd> to take a tour, or <kbd>guide</kbd>{' '}
                  to jump somewhere.
                </p>
                <div className="term-companion-actions">
                  <button type="button" onClick={startTour}>Start tour</button>
                  <button type="button" onClick={openGuide}>Open guide</button>
                  <button
                    type="button"
                    onClick={() => {
                      dismissCompanion()
                      inputRef.current?.focus()
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </aside>
          )}
          {entries.map((entry, i) => (
            <div
              className="term-entry"
              key={entry.id}
              ref={i === entries.length - 1 ? lastEntryRef : undefined}
            >
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
        {guideOpen && (
          <GuideMenu index={guideIndex} onIndexChange={setGuideIndex} onPick={selectGuideOption} />
        )}
        {tourStep !== null && (
          <TourControls
            step={Math.min(Math.max(tourStep, 1), TOUR_STEPS.length)}
            total={TOUR_STEPS.length}
            busy={tourBusy}
            done={tourStep >= TOUR_STEPS.length}
            onNext={advanceTour}
            onBack={() => setTourStep((step) => (step === null ? null : Math.max(0, step - 1)))}
            onExit={() => {
              setTourStep(null)
              setTourBusy(false)
              setInput('')
              inputRef.current?.focus()
            }}
          />
        )}
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
            placeholder="type a command - try 'guide', '?', or '/'"
            aria-describedby={error ? `${promptId}-err` : undefined}
            readOnly={tourStep !== null}
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
            Quick commands: <kbd>ls</kbd>{' '}
            <span className="term-tip-gloss">(list)</span>, <kbd>cd</kbd>{' '}
            <span className="term-tip-gloss">(change directory)</span>, <kbd>cat</kbd>{' '}
            <span className="term-tip-gloss">(print file)</span>
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
            x
          </button>
        </aside>
      )}
      <footer className="term-foot">
        <span>jerome fisher · management & technology · penn</span>
        <span className="term-foot-key">
          <kbd>tour</kbd> walkthrough · <kbd>guide</kbd> menu · theme: {theme}
        </span>
      </footer>
    </div>
  )
}

function TourControls({
  step,
  total,
  busy,
  done,
  onNext,
  onBack,
  onExit,
}: {
  step: number
  total: number
  busy: boolean
  done: boolean
  onNext: () => void
  onBack: () => void
  onExit: () => void
}) {
  return (
    <div className="term-tour-controls" role="group" aria-label="Tour controls">
      <span>{done ? 'tour complete' : `tour ${step}/${total}`}</span>
      <button type="button" onClick={onBack} disabled={busy || step <= 1}>Back</button>
      <button type="button" onClick={onNext} disabled={busy}>{done ? 'Finish' : 'Next'}</button>
      <button type="button" onClick={onExit}>Exit</button>
    </div>
  )
}

function GuideMenu({
  index,
  onIndexChange,
  onPick,
}: {
  index: number
  onIndexChange: (i: number) => void
  onPick: (i: number) => void
}) {
  return (
    <div className="term-guide-menu" role="listbox" aria-label="Guide menu">
      <p className="term-guide-title">What do you want to view?</p>
      {GUIDE_OPTIONS.map((option, i) => (
        <button
          type="button"
          key={option.label}
          role="option"
          aria-selected={i === index}
          className={`term-guide-item${i === index ? ' term-guide-item--active' : ''}`}
          onMouseEnter={() => onIndexChange(i)}
          onMouseDown={(e) => {
            e.preventDefault()
            onPick(i)
          }}
        >
          <span className="term-guide-marker">{i === index ? '>' : ' '}</span>
          <span className="term-guide-label">{option.label}</span>
          <span className="term-guide-hint">{option.hint}</span>
        </button>
      ))}
      <p className="term-guide-help">Use arrows, Enter, or click. Escape closes.</p>
    </div>
  )
}
