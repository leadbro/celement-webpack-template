import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock'

interface PopupElement extends Element {
  scrollWrapper?: HTMLElement
}

const ACTIVE_POPUPS: Record<string, string> = {}

export function getScrollbarGap(): number {
  const bodyStyles = window.getComputedStyle(document.body)

  const scrollBarGap = window.innerWidth - document.documentElement.clientWidth
  const paddingRight = parseInt(bodyStyles.getPropertyValue('padding-right'), 10)

  return scrollBarGap + paddingRight
}

export function setScrollbarGap(gap = 0): void {
  const root = document.documentElement
  root.style.setProperty('--scrollbar-gap', `${gap}px`)
}

// Заблокировать скролл у body
export function toggleBodyLock(name: string, isShowPopup = false): void {
  if (!name) return

  const popup = document.querySelector('#' + name) as PopupElement | null

  if (!popup?.scrollWrapper) {
    console.warn('scrollWrapper required')
    return
  }

  const options = { reserveScrollBarGap: false }

  if (isShowPopup) {
    ACTIVE_POPUPS[name] = name

    const gap = getScrollbarGap()
    if (gap > 0) setScrollbarGap(gap)

    disableBodyScroll(popup.scrollWrapper, options)
  } else {
    delete ACTIVE_POPUPS[name]

    const isRemoveLock = !Object.keys(ACTIVE_POPUPS).length

    if (isRemoveLock) {
      setScrollbarGap(0)
      enableBodyScroll(popup.scrollWrapper)
    }
  }
}
