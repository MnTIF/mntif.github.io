import { COMMANDS, argCompletionKind, type ArgCompletionKind } from './commands'
import { getNode, listDir, resolvePath } from './fs'

export type CompletionResult = {
  value: string
  cursor: number
  listing?: { name: string; isDir: boolean }[]
}

export function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return ''
  let prefix = strings[0]
  for (let i = 1; i < strings.length; i++) {
    const s = strings[i]
    let j = 0
    while (j < prefix.length && j < s.length && prefix[j] === s[j]) j++
    prefix = prefix.slice(0, j)
    if (prefix === '') break
  }
  return prefix
}

function tokenBoundsAt(input: string, cursor: number): { start: number; end: number } {
  let start = cursor
  while (start > 0 && !/\s/.test(input[start - 1])) start--
  let end = cursor
  while (end < input.length && !/\s/.test(input[end])) end++
  return { start, end }
}

function commandCandidates(prefix: string): string[] {
  const isSlash = prefix.startsWith('/')
  return COMMANDS.filter((c) => {
    if (c.hidden) return false
    if (isSlash) return c.name.startsWith('/') && c.name.startsWith(prefix)
    return !c.name.startsWith('/') && c.name.startsWith(prefix)
  }).map((c) => c.name)
}

function splitArg(arg: string): { dirPart: string; prefix: string } {
  const expanded = arg.startsWith('~') ? '/' + arg.slice(1).replace(/^\//, '') : arg
  const idx = expanded.lastIndexOf('/')
  if (idx === -1) return { dirPart: '', prefix: expanded }
  return { dirPart: expanded.slice(0, idx + 1), prefix: expanded.slice(idx + 1) }
}

function pathCandidates(
  arg: string,
  cwd: string,
  kind: Exclude<ArgCompletionKind, null | 'command'>,
): { name: string; isDir: boolean; full: string }[] {
  const { dirPart, prefix } = splitArg(arg)
  const resolved = resolvePath(cwd, dirPart || '.')
  const node = getNode(resolved)
  if (!node || node.kind !== 'dir') return []
  const entries = listDir(resolved) ?? []
  return entries
    .filter((e) => e.name.startsWith(prefix))
    .filter((e) => {
      if (kind === 'dir') return e.isDir
      return true
    })
    .map((e) => ({ name: e.name, isDir: e.isDir, full: dirPart + e.name }))
}

export function complete(input: string, cursor: number, cwd: string): CompletionResult | null {
  const { start, end } = tokenBoundsAt(input, cursor)
  const tokenToCursor = input.slice(start, cursor)
  const before = input.slice(0, start)
  const after = input.slice(end)

  const firstSpace = input.indexOf(' ')
  const inFirstToken = !/\s/.test(input.slice(0, start))

  if (inFirstToken) {
    return completeCommandToken(tokenToCursor, before, after)
  }

  const cmdName = input.slice(0, firstSpace).trim()
  const kind = argCompletionKind(cmdName)
  if (!kind) return null

  if (kind === 'command') {
    return completeCommandToken(tokenToCursor, before, after)
  }

  const candidates = pathCandidates(tokenToCursor, cwd, kind)
  if (candidates.length === 0) return null

  if (candidates.length === 1) {
    const c = candidates[0]
    const insert = c.full + (c.isDir ? '/' : ' ')
    const value = before + insert + after
    return { value, cursor: before.length + insert.length }
  }

  const names = candidates.map((c) => c.name)
  const lcp = longestCommonPrefix(names)
  const { dirPart, prefix } = splitArg(tokenToCursor)
  if (lcp.length > prefix.length) {
    const insert = dirPart + lcp
    const value = before + insert + after
    return { value, cursor: before.length + insert.length }
  }

  return {
    value: input,
    cursor,
    listing: candidates.map((c) => ({ name: c.name, isDir: c.isDir })),
  }
}

function completeCommandToken(
  tokenToCursor: string,
  before: string,
  after: string,
): CompletionResult | null {
  const candidates = commandCandidates(tokenToCursor)
  if (candidates.length === 0) return null
  if (candidates.length === 1) {
    const insert = candidates[0] + ' '
    return { value: before + insert + after, cursor: before.length + insert.length }
  }
  const lcp = longestCommonPrefix(candidates)
  if (lcp.length > tokenToCursor.length) {
    return { value: before + lcp + after, cursor: before.length + lcp.length }
  }
  return {
    value: before + tokenToCursor + after,
    cursor: before.length + tokenToCursor.length,
    listing: candidates.map((name) => ({ name, isDir: false })),
  }
}
