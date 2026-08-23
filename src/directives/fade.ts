// Плавное скрытие
export function fadeOut(element: HTMLElement, callback?: () => void): void {
  const onTransitionEnd = () => {
    element.removeEventListener('transitionend', onTransitionEnd)
    element.style.display = 'none'

    if (callback) callback()
  }

  element.style.opacity = '0'
  element.addEventListener('transitionend', onTransitionEnd)
}

// Плавное появление
export function fadeIn(element: HTMLElement, callback?: () => void): void {
  const onTransitionEnd = () => {
    element.removeEventListener('transitionend', onTransitionEnd)

    if (callback) callback()
  }

  element.style.removeProperty('display')

  setTimeout(() => {
    element.style.opacity = '1'
    element.addEventListener('transitionend', onTransitionEnd)
  }, 100)
}
