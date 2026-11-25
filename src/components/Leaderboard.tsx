import type { BoardEntry } from '../lib/leaderboard'

type Props = {
  entries: readonly BoardEntry[]
  boardAvg: number
  localAvg: number
  highlightId?: string | null
  title?: string
}

export function Leaderboard({
  entries,
  boardAvg,
  localAvg,
  highlightId,
  title = 'Climb leaderboard',
}: Props) {
  return (
    <section className="scroll-board" aria-label={title}>
      <header className="scroll-board-head">
        <h2 className="scroll-board-title">{title}</h2>
        <p className="scroll-board-avgs">
          <span>
            Board avg <strong>{boardAvg}%</strong>
          </span>
          <span className="scroll-board-avgs-sep" aria-hidden>
            ·
          </span>
          <span>
            Your avg <strong>{localAvg}%</strong>
          </span>
        </p>
      </header>
      <div className="scroll-board-table-wrap">
        <table className="scroll-board-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Clears</th>
              <th scope="col">Avg %</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((row, i) => {
              const mine = row.id === highlightId || row.local
              return (
                <tr
                  key={row.id}
                  className={
                    row.id === highlightId
                      ? 'is-you'
                      : mine
                        ? 'is-local'
                        : undefined
                  }
                >
                  <td>{i + 1}</td>
                  <td>
                    {row.name}
                    {row.id === highlightId ? (
                      <span className="scroll-board-you"> you</span>
                    ) : null}
                  </td>
                  <td>{row.clears}</td>
                  <td>{row.avgPct}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
