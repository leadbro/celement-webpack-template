import { camelToDash } from '@/utils/convert-case'
import throttle from '@/utils/throttle'

interface ComponentList {
  [key: string]: CustomElementConstructor
}

export interface AppConfig {
  components: ComponentList
}

export default class App {
  mediaScreen: string

  constructor(config: AppConfig) {
    const { components } = config

    // Инициализация кастомных элементов
    this._initComponents(components)

    // Событие после инициализации
    this.created()

    // Событие после загрузки страницы
    document.addEventListener('DOMContentLoaded', () => this.onload())

    // Тип экрана девайса
    this.mediaScreen = this._getMediaScreen()

    // Событие после ресайза страницы
    window.addEventListener('resize', throttle(() => {
      const oldScreen = this.mediaScreen
      const newScreen = this._getMediaScreen()

      this.mediaScreen = newScreen

      this.onresize(oldScreen, newScreen)
    }, 200))
  }

  // Lifecycle-хуки — переопределяются в наследнике
  created(): void {}
  onload(): void {}
  onresize(_oldScreen: string, _newScreen: string): void {}

  isTouchDevice(): boolean {
    return 'ontouchstart' in document.documentElement
  }

  isMobileScreen(): boolean {
    const screen = this._getMediaScreen()
    return !screen.includes('desktop')
  }

  isDesktopScreen(): boolean {
    const screen = this._getMediaScreen()
    return screen.includes('desktop')
  }

  _getMediaScreen(): string {
    const rootStyles = getComputedStyle(document.documentElement)
    return rootStyles.getPropertyValue('--media-screen').trim()
  }

  // Регистрация компонентов
  _initComponents(components: ComponentList): void {
    if (!components) return

    const componentsKeys = Object.keys(components)
    if (!componentsKeys.length) return

    componentsKeys.forEach((key: string) => {
      const component = components[key]
      const name = camelToDash(key)

      if (!customElements.get(name)) customElements.define(name, component)
    })
  }
}
