import { render, html } from 'lit-html'

export default class CElement extends HTMLElement {
  root: ShadowRoot | CElement
  observer?: IntersectionObserver
  intersectedCallback?(): void
  template?: string
  styles?: string

  constructor() {
    super()

    this.root = this.getRenderRoot()

    this.initIntersection()
  }

  // Переопределить в наследнике, если shadowDom не требуется
  getRenderRoot(): ShadowRoot | CElement {
    return typeof this.attachShadow === 'function'
      ? this.attachShadow({ mode: 'open' })
      : this
  }

  initIntersection(): void {
    if (typeof this.intersectedCallback !== 'function') return

    const observerOptions: IntersectionObserverInit = {
      rootMargin: '0px',
      threshold: 1.0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const element = entries[0]

      if (element.isIntersecting) {
        this.observer!.disconnect()
        this.intersectedCallback!()
      }
    }

    this.observer = new IntersectionObserver(observerCallback, observerOptions)

    this.observer.observe(this)
  }

  disconnectedCallback(): void {
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  get _template() {
    return this.template || ''
  }

  get _styles() {
    return this.styles ? html`<style>${this.styles}</style>` : ''
  }

  get _contentToRender() {
    return html`
      ${this._template}
      ${this._styles}
    `
  }

  // Создаёт и возвращает root-элемент для содержимого слота
  // Служит для передачи контента в слот изнутри компонента
  $createSlotRoot(slotName: string): HTMLDivElement | undefined {
    if (!slotName) {
      console.warn('slotName required')
      return
    }

    const root = document.createElement('div')
    root.setAttribute('slot', slotName)
    this.appendChild(root)

    return root
  }

  $find(query: string): Element | null {
    return this.root.querySelector(query)
  }

  $findAll(query: string): NodeListOf<Element> {
    return this.root.querySelectorAll(query)
  }

  $render(): void {
    render(this._contentToRender, this.root)
  }

  $update(): void {
    this.$render()
  }

  $on(eventName: keyof HTMLElementEventMap, callback: (e: Event) => void): void {
    this.addEventListener(eventName, callback)
  }

  $get(attributeName: string, toBoolean = false): string | null | boolean {
    // Для любых аттрибутов
    const attrValue = this.getAttribute(attributeName)
    if (!toBoolean) return attrValue

    // Для boolean-атрибутов
    const falsyValues: (string | null | undefined | boolean)[] = [null, undefined, false, 'false']
    return !falsyValues.includes(attrValue)
  }

  $set(attributeName: string, value: string, toBoolean = false): void {
    const isSet = !toBoolean || value

    if (isSet) {
      this.setAttribute(attributeName, value)
    } else {
      this.$remove(attributeName)
    }
  }

  $remove(attributeName: string): void {
    this.removeAttribute(attributeName)
  }

  $emit(eventName: string, params?: Record<string, unknown>): void {
    if (!eventName) return

    const event = new CustomEvent(eventName, { detail: params })
    this.dispatchEvent(event)
  }
}
