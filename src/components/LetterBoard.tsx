import { motion } from 'framer-motion'
import { isLetterRevealed } from '../lib/hangman'

type Props = {
  title: string
  guessed: ReadonlySet<string>
  forceReveal?: boolean
}

export function LetterBoard({ title, guessed, forceReveal }: Props) {
  const words = title.split(' ')

  return (
    <div className="letter-board" aria-label="Product title puzzle">
      {words.map((word, wi) => (
        <div className="letter-word" key={`${word}-${wi}`}>
          {[...word].map((ch, i) => {
            const show = forceReveal || isLetterRevealed(ch, guessed)
            return (
              <motion.span
                key={`${wi}-${i}`}
                className={`letter-slot${show ? ' is-revealed' : ''}`}
                initial={false}
                animate={show ? { y: 0, opacity: 1 } : { y: 4, opacity: 0.85 }}
              >
                {show ? ch : ''}
              </motion.span>
            )
          })}
        </div>
      ))}
    </div>
  )
}
