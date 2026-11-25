import { useEffect, useRef, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CategoryChips } from './components/CategoryChips'
import { Lives } from './components/Lives'
import { Keyboard } from './components/Keyboard'
import { LetterBoard } from './components/LetterBoard'
import { PriceGuess } from './components/PriceGuess'
import { Reveal } from './components/Reveal'
import { Stars } from './components/Stars'
import { TitleGuess } from './components/TitleGuess'
import { ZoomedProduct } from './components/ZoomedProduct'
import { useHangazonRound } from './hooks/useHangazonRound'
import { formatMoney } from './lib/scoring'
import type { LadderHistoryEntry } from './lib/ladder'
import './App.css'

function ClearedRung({
  entry,
  step,
}: {
  entry: LadderHistoryEntry
  step: number
}) {
  const cleared = entry.result === 'cleared'
  return (
    <article
      className={`ladder-rung ladder-rung-done is-${entry.result}`}
      aria-label={`Listing ${step} ${cleared ? 'cleared' : 'failed'}`}
    >
      <div className="rung-done-media" aria-hidden>
        <img src={entry.product.imageUrl} alt="" />
      </div>
      <div className="rung-done-copy">
        <p className="rung-done-meta">
          <span className="rung-step">#{step}</span>
          <span className={cleared ? 'rung-badge is-clear' : 'rung-badge is-fail'}>
            {cleared ? 'Cleared' : 'Failed'}
          </span>
          <span className="rung-done-score">{entry.priceScore}%</span>
        </p>
        <h2 className="rung-done-title">{entry.product.title}</h2>
        <p className="rung-done-price">
          {formatMoney(entry.product.price)}
          {entry.priceGuess.trim() ? (
            <span className="rung-done-guess">
              {' '}
              · guessed {entry.priceGuess}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  )
}

export default function App() {
  const game = useHangazonRound()
  const activeRungRef = useRef<HTMLElement | null>(null)
  const revealed =
    game.phase === 'reveal' || game.letterOutcome === 'guess'
  const titleKnown =
    revealed ||
    game.letterOutcome === 'lose' ||
    game.letterOutcome === 'guess'
  const bloodied = game.letterOutcome === 'lose'
  const showDeath =
    bloodied && game.phase === 'letters'
  const vibrating =
    game.phase === 'letters' &&
    game.letterOutcome === null &&
    game.typeSpeed > 2

  useEffect(() => {
    if (game.phase !== 'letters') return
    if (game.letterOutcome !== null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (
        t instanceof HTMLElement &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      ) {
        return
      }
      game.guessLetter(e.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [game.phase, game.letterOutcome, game.guessLetter])

  useEffect(() => {
    if (game.phase === 'intro') return
    if (game.scrollToken === 0) return
    const el = activeRungRef.current
    if (!el) return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }, [game.scrollToken, game.phase, game.product.id])

  return (
    <div
      className={[
        'app',
        vibrating ? 'is-vibrating' : '',
        bloodied ? 'is-bloodied' : '',
        bloodied && !showDeath ? 'is-blood-settled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        vibrating
          ? ({
              ['--vibe' as string]: String(
                Math.min(8, 1 + (game.typeSpeed - 1) * 0.35),
              ),
              ['--vibe-amp' as string]: `${Math.min(2.1, 0.28 + game.typeSpeed * 0.07)}px`,
            } as CSSProperties)
          : undefined
      }
    >
      {bloodied && (
        <div className="blood-overlay" aria-hidden>
          <div className="blood-column">
            <div className="blood-meniscus" />
            <div className="blood-body" />
          </div>
        </div>
      )}

      {showDeath && (
        <div
          className="death-overlay"
          role="alertdialog"
          aria-labelledby="you-died-label"
        >
          <p id="you-died-label" className="you-died">
            YOU DIED
          </p>
          <p className="death-sub">Streak breaks · out of attempts</p>
          <button
            type="button"
            className="btn btn-ghost death-next"
            onClick={game.continueAfterDeath}
          >
            Next
          </button>
        </div>
      )}

      <header className="topbar">
        <p className="brand brand-bar">Hangazon</p>
        <div className="topbar-search" aria-hidden>
          <span className="topbar-dept">All</span>
          <span className="topbar-field">Search Hangazon</span>
          <span className="topbar-go">Go</span>
        </div>
        {game.phase !== 'intro' && (
          <div className="topbar-meta">
            {game.phase === 'letters' && game.typeSpeed > 1 && (
              <span
                className="speed-pill"
                aria-label={`${game.typeSpeed}x speed`}
              >
                {game.typeSpeed}×
              </span>
            )}
            <span
              className="mode-pill streak-pill"
              aria-label={`Clears streak ${game.clears}`}
            >
              Clears {game.clears}
              {game.bestClears > 0 ? ` · best ${game.bestClears}` : ''}
            </span>
          </div>
        )}
      </header>
      <div className="subnav" aria-hidden>
        <span>Electronics</span>
        <span>Kitchen</span>
        <span>Home</span>
        <span>Fitness</span>
        <span>Travel</span>
        <span>Fashion</span>
      </div>

      {game.phase === 'intro' ? (
        <section className="hero">
          <div className="hero-visual" aria-hidden>
            <img src={game.product.imageUrl} alt="" className="hero-img" />
          </div>
          <div className="hero-copy">
            <p className="brand brand-hero">Hangazon</p>
            <p className="hero-tag">
              Clear a listing, unlock the next. How far can you climb?
            </p>
            <CategoryChips value={game.category} onChange={game.setCategory} />
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => game.startClimb(game.category)}
              >
                Start climb
              </button>
            </div>
          </div>
        </section>
      ) : (
        <main className="ladder">
          <p className="ladder-goal">
            Get as many clears as you can — finish one listing to unlock the
            next.
          </p>

          {game.history.map((entry, i) => (
            <ClearedRung key={`${entry.product.id}-${i}`} entry={entry} step={i + 1} />
          ))}

          <section
            ref={activeRungRef}
            className="ladder-rung ladder-rung-active round-pdp"
            id={`rung-active-${game.product.id}`}
            aria-label={`Listing ${game.history.length + 1} — active`}
          >
            <p className="breadcrumb">
              Hangazon › Ladder › #{game.history.length + 1} ›{' '}
              {game.product.category}
            </p>

            <div className="pdp">
              <div className="pdp-media">
                <ZoomedProduct
                  imageUrl={game.product.imageUrl}
                  alt={titleKnown ? game.product.title : 'Product'}
                  misses={game.misses}
                  revealed={revealed || game.phase === 'price' || bloodied}
                  shakeKey={game.shakeKey}
                />
              </div>

              <div className="pdp-center">
                <p className="pdp-brand-link">
                  Visit the {game.product.brand} Store
                </p>

                <LetterBoard
                  title={game.title}
                  guessed={game.guessed}
                  forceReveal={titleKnown}
                  flight={game.flight}
                  onFlightDone={game.finishFlight}
                  interactive={
                    game.phase === 'letters' && game.letterOutcome === null
                  }
                  onSubmitWord={game.submitWordGuess}
                />

                {(titleKnown || game.phase !== 'letters') && (
                  <Stars
                    rating={game.product.rating}
                    reviews={game.product.reviews}
                  />
                )}

                {game.phase === 'letters' && !showDeath && (
                  <div className="pdp-play">
                    <Lives misses={game.misses} />
                    <Keyboard
                      guessed={game.guessed}
                      title={game.title}
                      disabled={game.letterOutcome !== null}
                      pending={game.pendingLetters}
                      onGuess={game.guessLetter}
                    />
                  </div>
                )}

                {game.phase === 'price' && (
                  <p className="pdp-hint">How much does this listing cost?</p>
                )}
              </div>

              <aside className="pdp-buybox">
                <AnimatePresence mode="wait">
                  {game.phase === 'letters' && !showDeath && (
                    <motion.div
                      key="box-letters"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="buybox-shell"
                    >
                      <TitleGuess
                        value={game.titleGuess}
                        onChange={game.setTitleGuess}
                        onSubmit={game.submitTitleGuess}
                        disabled={game.letterOutcome !== null}
                        wrong={game.titleGuessWrong}
                      />
                      <p className="buybox-stock">In Stock</p>
                      <p className="buybox-ships">
                        Ships from Hangazon · Sold by demo
                      </p>
                    </motion.div>
                  )}
                  {game.phase === 'price' && (
                    <motion.div
                      key="box-price"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="buybox-shell"
                    >
                      <PriceGuess
                        value={game.priceGuess}
                        onChange={game.setPriceGuess}
                        onSubmit={game.submitPrice}
                      />
                    </motion.div>
                  )}
                  {game.phase === 'reveal' && game.priceScore !== null && (
                    <motion.div
                      key="box-reveal"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="buybox-shell buybox-shell-reveal"
                    >
                      <Reveal
                        product={game.product}
                        priceScore={game.priceScore}
                        priceGuess={game.priceGuess}
                        blankBonus={game.blankBonus}
                        blanksAtGuess={game.blanksAtGuess}
                        againLabel="Next listing"
                        onAgain={game.advanceLadder}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </aside>
            </div>
          </section>

          {game.lockedAhead.map((p, i) => (
            <article
              key={p.id}
              className="ladder-rung ladder-rung-locked"
              aria-hidden
            >
              <div className="rung-locked-media">
                <img src={p.imageUrl} alt="" />
              </div>
              <div className="rung-locked-copy">
                <p className="rung-step">
                  #{game.history.length + 2 + i} · Locked
                </p>
                <p className="rung-locked-hint">Clear the listing above to unlock</p>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  )
}
