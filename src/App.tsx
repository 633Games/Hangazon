import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gallows } from './components/Gallows'
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
      <div className="atmosphere" aria-hidden />

      {game.phase === 'intro' ? (
        <section className="hero">
          <motion.p
            className="brand"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            Hangazon
          </motion.p>
          <motion.h1
            className="hero-line"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            Guess the product. Nail the price.
          </motion.h1>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.5 }}
          >
            A zoomed listing drops in. Type letters to reveal the name, then
            score the sticker price from 0–100%.
          </motion.p>
          <motion.button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={game.start}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45 }}
            whileTap={{ scale: 0.98 }}
          >
            Deal me a listing
          </motion.button>
          <div className="hero-visual" aria-hidden>
            <img src={game.product.imageUrl} alt="" className="hero-img" />
          </div>
        </section>
      ) : (
        <main className="round">
          <header className="round-top">
            <p className="brand brand-sm">Hangazon</p>
            {game.phase === 'letters' && <Gallows misses={game.misses} />}
          </header>

          <ZoomedProduct
            imageUrl={game.product.imageUrl}
            alt={revealed ? game.product.title : 'Mystery product'}
            misses={game.misses}
            revealed={revealed}
            shakeKey={game.shakeKey}
          />

          <LetterBoard
            title={game.title}
            guessed={game.guessed}
            forceReveal={revealed || game.letterOutcome === 'lose'}
          />

          <AnimatePresence mode="wait">
            {game.phase === 'letters' && (
              <motion.div
                key="letters"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <Keyboard
                  guessed={game.guessed}
                  title={game.title}
                  disabled={game.letterOutcome !== null}
                  onGuess={game.guessLetter}
                />
              </motion.div>
            )}
            {game.phase === 'price' && (
              <motion.div
                key="price"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <PriceGuess
                  value={game.priceGuess}
                  onChange={game.setPriceGuess}
                  onSubmit={game.submitPrice}
                  letterOutcome={game.letterOutcome}
                />
              </motion.div>
            )}
            {game.phase === 'reveal' && game.priceScore !== null && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Reveal
                  product={game.product}
                  priceScore={game.priceScore}
                  priceGuess={game.priceGuess}
                  letterOutcome={game.letterOutcome}
                  onAgain={game.playAgain}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}
    </div>
  )
}
