import { motion, useAnimationControls } from 'framer-motion'
import { useEffect } from 'react'
import { zoomScale } from '../lib/hangman'

type Props = {
  imageUrl: string
  alt: string
  misses: number
  revealed: boolean
  shakeKey: number
}

export function ZoomedProduct({
  imageUrl,
  alt,
  misses,
  revealed,
  shakeKey,
}: Props) {
  const scale = zoomScale(misses, revealed)
  const shake = useAnimationControls()

  useEffect(() => {
    if (shakeKey <= 0 || revealed) return
    void shake.start({
      x: [0, -10, 10, -6, 6, 0],
      transition: { duration: 0.35 },
    })
  }, [shakeKey, revealed, shake])

  return (
    <motion.div className="zoom-stage" animate={shake}>
      <div className="zoom-frame">
        <motion.img
          src={imageUrl}
          alt={alt}
          className="zoom-image"
          animate={{
            scale,
            filter: revealed
              ? 'blur(0px)'
              : `blur(${Math.max(0, 2.5 - misses * 0.35)}px)`,
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          draggable={false}
        />
        {!revealed && <div className="zoom-vignette" aria-hidden />}
      </div>
    </motion.div>
  )
}
