// Закрыть аккордеон
export function collapse(element: HTMLElement): void {
  const sectionHeight = element.scrollHeight

  // Временно отключить CSS-transitions
  const elementTransition = element.style.transition
  element.style.transition = ''

  requestAnimationFrame(() => {
    element.style.height = sectionHeight + 'px'
    element.style.transition = elementTransition

    requestAnimationFrame(() => {
      element.style.height = '0px'
    })
  })
}

// Раскрыть аккордеон
export function expand(element: HTMLElement): void {
  const sectionHeight = element.scrollHeight

  element.style.height = sectionHeight + 'px'

  const onTransitionEnd = () => {
    element.removeEventListener('transitionend', onTransitionEnd)
    element.style.height = ''
  }

  element.addEventListener('transitionend', onTransitionEnd)
}
