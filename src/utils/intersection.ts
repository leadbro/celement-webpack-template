type IntersectionCallback = (element?: HTMLElement) => void

function applyIntersectionObserver(
  element: HTMLElement,
  callback: IntersectionCallback,
  intermediate = false
): IntersectionObserver | undefined {
  if (typeof callback !== 'function') return

  const observerOptions: IntersectionObserverInit = {}

  if (!intermediate) {
    observerOptions.threshold = 0.6
  }

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0]

    if (entry.isIntersecting) {
      callback()
    }
  }

  const observer = new IntersectionObserver(observerCallback, observerOptions)

  observer.observe(element)

  return observer
}

export function onElementShow(
  element: HTMLElement,
  callback: IntersectionCallback,
  intermediate = false
): void {
  if (typeof callback !== 'function') return

  const observer = applyIntersectionObserver(
    element,
    () => {
      observer?.unobserve(element)

      requestAnimationFrame(() => {
        callback(element)
      })
    },
    intermediate
  )
}
