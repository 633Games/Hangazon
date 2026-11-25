import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CategoryChips } from './components/CategoryChips'
import { Lives } from './components/Lives'
import { Keyboard } from './components/Keyboard'
import { LetterBoard } from './components/LetterBoard'
import { PriceGuess } from './components/PriceGuess'
import { Reveal } from './components/Reveal'
import { Stars } from './components/Stars'
import {
  TitleGuess,
  type TitleGuessHandle,
} from './components/TitleGuess'
import { ZoomedProduct } from './components/ZoomedProduct'
import { useHangazonRound } from './hooks/useHangazonRound'
import './App.css'

export default function App() {
  const game = useHangazonRound()
  const titleGuessRef = useRef<TitleGuessHandle>(null)
  const [titleGuessMode, setTitleGuessMode] = useState<'word' | 'title'>(
    'word',
  )
  const [selectedTitleWord, setSelectedTitleWord] = useState<number | null>(
    null,
  )
  const revealed =
    game.phase === 'reveal' || game.letterOutcome === 'guess'
  const titleKnown =
    revealed ||
    game.letterOutcome === 'lose' ||
    game.letterOutcome === 'guess'

  const onTitleGuessActiveChange = useCallback(
    (state: { mode: 'word' | 'title'; wordIndex: number | null }) => {
      setTitleGuessMode(state.mode)
      setSelectedTitleWord(state.wordIndex)
    },
    [],
  )

  useEffect(() => {
    if (game.phase !== 'letters') return
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
  }, [game.phase, game.guessLetter])

  return (
    <div className="app">
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
            <span className="mode-pill">
              {game.mode === 'daily' ? 'Daily' : game.category}
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
            <CategoryChips value={game.category} onChange={game.setCategory} />
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={game.startDaily}
                disabled={game.dailyDone}
              >
                {game.dailyDone
                  ? 'Daily done'
                  : `Daily · ${game.todayCategory}`}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-lg"
                onClick={() => game.startRandom(game.category)}
              >
                Random
              </button>
            </div>
          </div>
        </section>
      ) : (
        <main className="round round-pdp">
          <p className="breadcrumb" aria-hidden>
            Hangazon › {game.product.category} › Listing
          </p>

          <div className="pdp">
            <div className="pdp-media">
              <ZoomedProduct
                imageUrl={game.product.imageUrl}
                alt={titleKnown ? game.product.title : 'Product'}
                misses={game.misses}
                revealed={revealed || game.phase === 'price'}
                shakeKey={game.shakeKey}
              />
            </div>

            <div className="pdp-center">
              <p className="pdp-brand-link">Visit the {game.product.brand} Store</p>

              <LetterBoard
                title={game.title}
                guessed={game.guessed}
                forceReveal={titleKnown}
                flight={game.flight}
                onFlightDone={game.finishFlight}
                interactive={
                  game.phase === 'letters' && game.letterOutcome === null
                }
                selectedWord={
                  titleGuessMode === 'word' ? selectedTitleWord : null
                }
                onWordClick={(index) =>
                  titleGuessRef.current?.selectWord(index)
                }
              />

              {(titleKnown || game.phase !== 'letters') && (
                <Stars
                  rating={game.product.rating}
                  reviews={game.product.reviews}
                />
              )}

              {game.phase === 'letters' && (
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
                {game.phase === 'letters' && (
                  <motion.div
                    key="box-letters"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="buybox-shell"
                  >
                    <TitleGuess
                      ref={titleGuessRef}
                      title={game.title}
                      guessed={game.guessed}
                      value={game.titleGuess}
                      onChange={game.setTitleGuess}
                      onSubmitWord={game.submitWordGuess}
                      onSubmitTitle={game.submitTitleGuess}
                      disabled={game.letterOutcome !== null}
                      wrong={game.titleGuessWrong}
                      onActiveChange={onTitleGuessActiveChange}
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
                      againLabel={game.mode === 'daily' ? 'Random' : 'Again'}
                      onAgain={game.playAgain}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>
          </div>
        </main>
      )}
    </div>
  )
}
