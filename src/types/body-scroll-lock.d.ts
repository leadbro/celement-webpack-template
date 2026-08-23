declare module 'body-scroll-lock' {
  interface BodyScrollOptions {
    reserveScrollBarGap?: boolean
    allowTouchMove?: (el: EventTarget | null) => boolean
  }

  function disableBodyScroll(targetElement: HTMLElement, options?: BodyScrollOptions): void
  function enableBodyScroll(targetElement: HTMLElement): void
  function clearAllBodyScrollLocks(): void
}
