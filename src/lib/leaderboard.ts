/** Scroll leaderboard — seeded fakes + localStorage player runs. */

export type BoardEntry = {
  id: string
  name: string
  /** Listings cleared before the Scroll ended */
  clears: number
  /** Mean price score % across cleared listings (0 if none) */
  avgPct: number
  at: number
  /** True when this row came from a local player submission */
  local?: boolean
}

const STORAGE_KEY = 'hangazon-scroll-board-v1'

/** Baked rivals so the board never looks empty. */
export const FAKE_BOARD: BoardEntry[] = [
  {
    id: 'fake-mira',
    name: 'Mira Cart',
    clears: 7,
    avgPct: 91,
    at: Date.UTC(2026, 10, 20, 14, 0),
  },
  {
    id: 'fake-jon',
    name: 'Jon Deal',
    clears: 5,
    avgPct: 84,
    at: Date.UTC(2026, 10, 21, 9, 30),
  },
  {
    id: 'fake-priya',
    name: 'Priya Scroll',
    clears: 4,
    avgPct: 88,
    at: Date.UTC(2026, 10, 22, 18, 12),
  },
  {
    id: 'fake-ed',
    name: 'Ed Basket',
    clears: 3,
    avgPct: 72,
    at: Date.UTC(2026, 10, 23, 11, 5),
  },
  {
    id: 'fake-sam',
    name: 'Sam Aisle',
    clears: 2,
    avgPct: 79,
    at: Date.UTC(2026, 10, 24, 16, 40),
  },
  {
    id: 'fake-lee',
    name: 'Lee Prime',
    clears: 1,
    avgPct: 65,
    at: Date.UTC(2026, 10, 25, 8, 20),
  },
  {
    id: 'fake-nix',
    name: 'Nix Zero',
    clears: 0,
    avgPct: 0,
    at: Date.UTC(2026, 10, 25, 10, 0),
  },
]

export function averagePct(scores: readonly number[]): number {
  if (scores.length === 0) return 0
  const sum = scores.reduce((a, n) => a + n, 0)
  return Math.round(sum / scores.length)
}

function sortBoard(entries: BoardEntry[]): BoardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.clears !== a.clears) return b.clears - a.clears
    if (b.avgPct !== a.avgPct) return b.avgPct - a.avgPct
    return b.at - a.at
  })
}

function readLocal(): BoardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as BoardEntry[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (e) =>
        e &&
        typeof e.id === 'string' &&
        typeof e.name === 'string' &&
        typeof e.clears === 'number' &&
        typeof e.avgPct === 'number',
    )
  } catch {
    return []
  }
}

function writeLocal(entries: BoardEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    /* ignore quota / private mode */
  }
}

/** Merged fake + local rows, ranked. */
export function loadBoard(): BoardEntry[] {
  const local = readLocal().map((e) => ({ ...e, local: true as const }))
  return sortBoard([...FAKE_BOARD, ...local])
}

export function boardAveragePct(entries: readonly BoardEntry[]): number {
  if (entries.length === 0) return 0
  return averagePct(entries.map((e) => e.avgPct))
}

/** Mean Avg % across the player's own local runs only. */
export function localRunsAveragePct(entries: readonly BoardEntry[]): number {
  const mine = entries.filter((e) => e.local)
  if (mine.length === 0) return 0
  return averagePct(mine.map((e) => e.avgPct))
}

export function addLocalRun(input: {
  name: string
  clears: number
  avgPct: number
}): BoardEntry {
  const entry: BoardEntry = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim().slice(0, 24) || 'Guest',
    clears: Math.max(0, Math.round(input.clears)),
    avgPct: Math.max(0, Math.min(100, Math.round(input.avgPct))),
    at: Date.now(),
    local: true,
  }
  const next = [...readLocal(), entry]
  writeLocal(next)
  return entry
}
