import { useEffect, useRef } from 'react'

/**
 * Attach the returned ref to any element that already has a `.reveal` class
 * (or `.reveal--from-left`, `.reveal--from-right`, `.reveal--scale`).
 * When the element enters the viewport, `reveal--visible` is added, which
 * triggers the CSS transition defined in global.css.
 *
 * The observer disconnects after the first intersection (one-shot) so there
 * is no ongoing overhead.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already visible (e.g. above the fold on load) — show immediately
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('reveal--visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal--visible')
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
