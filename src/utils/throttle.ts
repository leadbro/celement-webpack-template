export default function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay = 900,
  immediate = false
): (...args: Parameters<T>) => void {
  let timerId: number | null = null

  return (...args: Parameters<T>) => {
    if (timerId) return

    if (immediate && !timerId) {
      func(...args)
    }

    timerId = window.setTimeout(() => {
      if (!immediate) {
        func(...args)
      }
      timerId = null
    }, delay)
  }
}
