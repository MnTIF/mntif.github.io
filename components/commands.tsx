import type { ReactNode } from 'react'
import figlet from 'figlet'
import standardFont from 'figlet/importable-fonts/Standard.js'
import { getNode, listDir, resolvePath, type FsDir } from './fs'

let figletFontLoaded = false
function renderFiglet(text: string): string {
  if (!figletFontLoaded) {
    figlet.parseFont('Standard', standardFont as unknown as string)
    figletFontLoaded = true
  }
  return figlet.textSync(text, { font: 'Standard' })
}

/** Full-title banner for `whoami` (computed once; Standard font is one figlet “block”). */
const WHOAMI_BANNER = renderFiglet('M&T Innovation Fund').trimEnd()

export type Theme = 'dark' | 'light'

export type CmdCtx = {
  cwd: string
  setCwd: (p: string) => void
  clear: () => void
  setTheme: (t: Theme) => void
  theme: Theme
  navigate: (href: string) => void
  history: string[]
}

export type Command = {
  name: string
  summary: string
  usage?: string
  hidden?: boolean
  run: (args: string[], ctx: CmdCtx) => ReactNode | null
}

function ErrorLine({ children }: { children: ReactNode }) {
  return <p className="term-line term-line--err">{children}</p>
}

function PlainLine({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return <p className={`term-line${dim ? ' term-line--dim' : ''}`}>{children}</p>
}
const Whoami = () => (
  <div className="term-output term-home">
    <pre className="term-ascii term-ascii--banner" aria-hidden="true">
      {WHOAMI_BANNER}
    </pre>
    <p className="term-para">
      M&amp;T Innovation Fund &mdash; a student-led venture organization at the
      Jerome Fisher Program in Management &amp; Technology, University of
      Pennsylvania.
    </p>
  </div>
)

function HelpOutput({ commands }: { commands: Command[] }) {
  return (
    <div className="term-output">
      <p className="term-line term-line--dim">Commands:</p>
      <ul className="term-cmdlist" role="list">
        {commands
          .filter((c) => !c.hidden && !c.name.startsWith('/'))
          .map((c) => (
            <li key={c.name}>
              <span className="term-cmdname">{c.name}</span>
              {c.usage && (
                <span className="term-cmdargs"> {c.usage.replace(c.name, '').trim()}</span>
              )}
              <span className="term-cmdsep">·</span>
              <span className="term-cmdhint">{c.summary}</span>
            </li>
          ))}
      </ul>
      <p className="term-line term-line--dim" style={{ marginTop: '1rem' }}>
        Tip: <kbd>/</kbd> opens the slash menu &middot; <kbd>?</kbd> shows this
        help &middot; <kbd>&uarr;</kbd>/<kbd>&darr;</kbd> for history.
      </p>
    </div>
  )
}

export const COMMANDS: Command[] = [
  {
    name: 'help',
    summary: 'list available commands and filesystem',
    usage: 'help',
    run: () => <HelpOutput commands={COMMANDS} />,
  },
  {
    name: '?',
    summary: "alias for 'help'",
    hidden: true,
    run: () => <HelpOutput commands={COMMANDS} />,
  },
  {
    name: 'ls',
    summary: 'list directory contents',
    usage: 'ls [path]',
    run: (args, ctx) => {
      const target = resolvePath(ctx.cwd, args[0])
      const node = getNode(target)
      if (!node) return <ErrorLine>ls: {args[0] ?? target}: no such file or directory</ErrorLine>
      if (node.kind === 'file')
        return <p className="term-line">{args[0] ?? target.split('/').pop()}</p>
      const entries = listDir(target)!
      return (
        <div className="term-output">
          <div className="term-ls">
            {entries.map((e) => (
              <span key={e.name} className={e.isDir ? 'term-ls-dir' : 'term-ls-file'}>
                {e.isDir ? `${e.name}/` : e.name}
              </span>
            ))}
          </div>
        </div>
      )
    },
  },
  {
    name: 'tree',
    summary: 'list contents recursively as a tree',
    usage: 'tree [path]',
    run: (args, ctx) => {
      const target = resolvePath(ctx.cwd, args[0])
      const node = getNode(target)
      if (!node) return <ErrorLine>tree: {args[0] ?? target}: no such file or directory</ErrorLine>
      if (node.kind === 'file')
        return <p className="term-line">{args[0] ?? target.split('/').pop()}</p>
      const lines: ReactNode[] = []
      const walk = (n: FsDir, prefix: string, path: string) => {
        const entries = Object.entries(n.children)
        entries.forEach(([name, child], i) => {
          const isLast = i === entries.length - 1
          const connector = isLast ? '└── ' : '├── '
          const label = child.kind === 'dir' ? `${name}/` : name
          const childPath = `${path}/${name}`
          lines.push(
            <p key={childPath} className="term-line">
              <span className="term-line--dim">{prefix + connector}</span>
              <span className={child.kind === 'dir' ? 'term-ls-dir' : 'term-ls-file'}>{label}</span>
            </p>,
          )
          if (child.kind === 'dir') walk(child, prefix + (isLast ? '    ' : '│   '), childPath)
        })
      }
      walk(node, '', target)
      return (
        <div className="term-output">
          <p className="term-line">{target === '/' ? '~' : '~' + target}</p>
          {lines}
        </div>
      )
    },
  },
  {
    name: 'cd',
    summary: 'change directory',
    usage: 'cd [path]',
    run: (args, ctx) => {
      const arg = args[0] ?? '~'
      const target = resolvePath(ctx.cwd, arg)
      const node = getNode(target)
      if (!node) return <ErrorLine>cd: {arg}: no such file or directory</ErrorLine>
      if (node.kind !== 'dir') return <ErrorLine>cd: {arg}: not a directory</ErrorLine>
      ctx.setCwd(target)
      return null
    },
  },
  {
    name: 'cat',
    summary: 'print file contents',
    usage: 'cat <file>',
    run: (args, ctx) => {
      if (!args[0]) return <ErrorLine>cat: missing operand</ErrorLine>
      const target = resolvePath(ctx.cwd, args[0])
      const node = getNode(target)
      if (!node) return <ErrorLine>cat: {args[0]}: no such file or directory</ErrorLine>
      if (node.kind !== 'file') return <ErrorLine>cat: {args[0]}: is a directory</ErrorLine>
      return node.render()
    },
  },
  {
    name: 'pwd',
    summary: 'print working directory',
    usage: 'pwd',
    run: (_args, ctx) => <p className="term-line">{ctx.cwd}</p>,
  },
  {
    name: 'whoami',
    summary: 'about the fund',
    usage: 'whoami',
    run: () => <Whoami />,
  },
  {
    name: 'apply',
    summary: 'how to apply',
    usage: 'apply',
    run: () => (
      <p className="term-line term-line--dim">
        we are not currently accepting applications, please check back later.
      </p>
    ),
  },
  {
    name: 'contact',
    summary: 'how to reach us',
    usage: 'contact',
    run: (_args, ctx) => COMMANDS.find((c) => c.name === 'cat')!.run(['/contact.md'], ctx),
  },
  {
    name: 'echo',
    summary: 'print text',
    usage: 'echo <text>',
    run: (args) => <p className="term-line">{args.join(' ')}</p>,
  },
  {
    name: 'figlet',
    summary: 'render text as ascii art',
    usage: 'figlet <text>',
    run: (args) => {
      if (args.length === 0) return <ErrorLine>figlet: missing operand</ErrorLine>
      try {
        const art = renderFiglet(args.join(' '))
        return (
          <div className="term-output">
            <pre className="term-ascii" aria-label={args.join(' ')}>{art}</pre>
          </div>
        )
      } catch (err) {
        return <ErrorLine>figlet: {(err as Error).message}</ErrorLine>
      }
    },
  },
  {
    name: 'date',
    summary: 'print current date',
    usage: 'date',
    run: () => <p className="term-line">{new Date().toString()}</p>,
  },
  {
    name: 'man',
    summary: 'show command usage',
    usage: 'man <cmd>',
    run: (args) => {
      if (!args[0]) return <ErrorLine>man: missing operand</ErrorLine>
      const cmd = COMMANDS.find((c) => c.name === args[0])
      if (!cmd) return <ErrorLine>No manual entry for {args[0]}</ErrorLine>
      return (
        <div className="term-output">
          <p className="term-line"><span className="term-cmdname">{cmd.name}</span></p>
          <p className="term-para term-para--dim">{cmd.summary}</p>
          {cmd.usage && (
            <p className="term-line term-line--dim">usage: {cmd.usage}</p>
          )}
        </div>
      )
    },
  },
  {
    name: 'history',
    summary: 'show command history',
    usage: 'history',
    run: (_args, ctx) => {
      if (ctx.history.length === 0)
        return <p className="term-line term-line--dim">(no history)</p>
      const width = String(ctx.history.length).length
      return (
        <div className="term-output">
          {ctx.history.map((cmd, i) => (
            <p key={i} className="term-line">
              <span className="term-line--dim">{String(i + 1).padStart(width, ' ')}  </span>
              {cmd}
            </p>
          ))}
        </div>
      )
    },
  },
  {
    name: 'clear',
    summary: 'clear the scrollback',
    usage: 'clear',
    run: (_args, ctx) => {
      ctx.clear()
      return null
    },
  },
  {
    name: '/theme',
    summary: 'switch theme (light/dark, or toggle)',
    usage: '/theme [light|dark]',
    run: (args, ctx) => {
      const arg = args[0]?.toLowerCase()
      if (!arg) {
        const next: Theme = ctx.theme === 'dark' ? 'light' : 'dark'
        ctx.setTheme(next)
        return <p className="term-line term-line--dim">theme: {next}</p>
      }
      if (arg !== 'light' && arg !== 'dark')
        return <ErrorLine>/theme: expected &apos;light&apos; or &apos;dark&apos;</ErrorLine>
      ctx.setTheme(arg)
      return <p className="term-line term-line--dim">theme: {arg}</p>
    },
  },
  {
    name: '/help',
    summary: "alias for 'help'",
    hidden: true,
    run: () => <HelpOutput commands={COMMANDS} />,
  },
  {
    name: '/clear',
    summary: "alias for 'clear'",
    hidden: true,
    run: (_a, ctx) => { ctx.clear(); return null },
  },
  {
    name: '/blog',
    summary: 'open the blog page',
    usage: '/blog',
    run: (_a, ctx) => {
      ctx.navigate('/blog/')
      return <p className="term-line term-line--dim">opening /blog/&hellip;</p>
    },
  },
]

export const SLASH_COMMANDS: Command[] = COMMANDS.filter((c) => c.name.startsWith('/'))

export type ArgCompletionKind = 'file' | 'dir' | 'any' | 'command' | null

export function argCompletionKind(name: string): ArgCompletionKind {
  switch (name) {
    case 'cd':
      return 'dir'
    case 'cat':
      return 'file'
    case 'ls':
    case 'tree':
      return 'any'
    case 'man':
      return 'command'
    default:
      return null
  }
}

export function parse(line: string): { name: string; args: string[] } {
  const trimmed = line.trim()
  if (!trimmed) return { name: '', args: [] }
  const parts = trimmed.split(/\s+/)
  return { name: parts[0], args: parts.slice(1) }
}

export function findCommand(name: string): Command | null {
  if (name === '?') return COMMANDS.find((c) => c.name === '?') ?? null
  return COMMANDS.find((c) => c.name === name) ?? null
}

