import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CategoryChips } from './components/CategoryChips'
import { Gallows } from './components/Gallows'
import { Lives } from './components/Lives'
import { Keyboard } from './components/Keyboard'
import { LetterBoard } from './components/LetterBoard'
import { PriceGuess } from './components/PriceGuess'
import { Reveal } from './components/Reveal'
import { ZoomedProduct } from './components/ZoomedProduct'
import { useHangazonRound } from './hooks/useHangazonRound'
import './App.css'

export default function App() {
  const game = useHangazonRound()
  const revealed = game.phase === 'reveal'

  useEffect(() => {
    if (game.phase !== 'letters') return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      game.guessLetter(e.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [game.phase, game.guessLetter])

  return (
    <div className="app">
      <header className="topbar">
        <p className="brand brand-bar">Hangazon</p>
        {game.phase !== 'intro' && (
          <div className="topbar-meta">
            {game.phase === 'letters' && game.typeSpeed > 1 && (
              <span className="speed-pill" aria-label={`${game.typeSpeed}x speed`}>
                {game.typeSpeed}×
              </span>
            )}
            <span className="mode-pill">
              {game.mode === 'daily' ? 'Daily' : game.category}
            </span>
          </div>
        )}
      </header>

      {game.phase === 'intro' ? (
        <section className="hero">
          <div className="hero-visual" aria-hidden>
            <img src={game.product.imageUrl} alt="" className="hero-img" />
          </div>
          <div className="hero-copy">
            <p className="brand brand-hero">Hangazon</p>
            <CategoryChips value={game.category} onChange={game.setCategory} />
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => void game.startDaily()}
                disabled={game.dailyDone || game.loading}
              >
                {game.dailyDone
                  ? 'Daily done'
                  : game.loading
                    ? '…'
                    : `Daily · ${game.todayCategory}`}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-lg"
                onClick={() => void game.startRandom(game.category)}
                disabled={game.loading}
              >
                {game.loading ? '…' : 'Random'}
              </button>
            </div>
            <p className="catalog-source" data-source={game.catalogSource}>
              {game.catalogSource === 'amazon' ? 'Amazon live' : 'Sample'}
            </p>
          </div>
        </section>
      ) : (
        <main className="round">
          <div className="round-top">
            {game.phase === 'letters' ? (
              <>
                <Lives misses={game.misses} />
                <Gallows misses={game.misses} />
              </>
            ) : (
              <span />
            )}
          </div>

          <div className="store-well">
            <ZoomedProduct
              imageUrl={game.product.imageUrl}
              alt={revealed ? game.product.title : 'Product'}
              misses={game.misses}
              revealed={revealed}
              shakeKey={game.shakeKey}
            />

            <div className="store-side">
              <LetterBoard
                title={game.title}
                guessed={game.guessed}
                forceReveal={revealed || game.letterOutcome === 'lose'}
                flight={game.flight}
                onFlightDone={game.finishFlight}
              />

              <AnimatePresence mode="wait">
                {game.phase === 'letters' && (
                  <motion.div
                    key="letters"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    <Keyboard
                      guessed={game.guessed}
                      title={game.title}
                      disabled={game.letterOutcome !== null}
                      pending={game.pendingLetters}
                      onGuess={game.guessLetter}
                    />
                  </motion.div>
                )}
                {game.phase === 'price' && (
                  <motion.div
                    key="price"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
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
                    key="reveal"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Reveal
                      product={game.product}
                      priceScore={game.priceScore}
                      priceGuess={game.priceGuess}
                      againLabel={game.mode === 'daily' ? 'Random' : 'Again'}
                      onAgain={game.playAgain}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
