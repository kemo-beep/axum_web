import type { Variants } from 'framer-motion'

/** Stagger container: children animate in sequence (0.1s stagger). */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

/** Stagger container with slower stagger (0.15s). Used by PlansPage. */
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

/** Stagger item: slides up with spring. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, bounce: 0.4 },
  },
}

/** Stagger item with larger y offset. Used by PlansPage. */
export const staggerItemY30: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, bounce: 0.3 },
  },
}

/** Tab content transition variants. Used by OrgDetailPage. */
export const tabVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
}
