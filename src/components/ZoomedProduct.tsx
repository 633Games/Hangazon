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
      x: [0, -8, 8, -4, 4, 0],
      transition: { duration: 0.32 },
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
              ? 'blur(0px) brightness(1)'
              : `blur(${Math.max(0, 2.4 - misses * 0.3)}px) brightness(${1 - misses * 0.04})`,
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          draggable={false}
        />
      </div>
    </motion.div>
  )
}
