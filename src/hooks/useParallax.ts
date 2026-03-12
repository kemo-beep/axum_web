import { useScroll, useTransform } from 'framer-motion'

/**
 * Creates a parallax effect based on scroll position.
 * @param distance - Pixel distance to move (default 50)
 */
export function useParallax(distance: number = 50) {
  const { scrollY } = useScroll()
  return useTransform(scrollY, [0, 1000], [0, -distance])
}
