import { camelToDash } from '@/utils/convert-case'
import throttle from '@/utils/throttle'

import CElement from '@/components/c-element/c-element'

interface ComponentList {
  [key: string]: CustomElementConstructor
}

interface MethodList {
  [key: string]: (...args: unknown[]) => unknown
}

export interface AppConfig {
  components: ComponentList
  methods?: MethodList
  created?: () => void
  onresize?: (oldScreen: string, newScreen: string) => void
  onload?: () => void
}

export default class App {
  mediaScreen: string;
  [key: string]: unknown

  constructor(config: AppConfig) {
    const {
      components,
      methods,
      created,
      onresize,
      onload
    } = config

    // Инициализация переданных методов
    if (methods) this._initMethods(methods)

    // Инициализация кастомных элементов
    this._initComponents(components)

    // Событие после инициализации
    if (created) created.call(this)

    // Событие после загрузки страницы
    if (onload) {
      document.addEventListener('DOMContentLoaded', onload.bind(this))
    }

    // Тип экрана девайса
    this.mediaScreen = this._getMediaScreen()

    // Событие после ресайза страницы
    window.addEventListener('resize', throttle(() => {
      const oldScreen = this.mediaScreen
      const newScreen = this._getMediaScreen()

      this.mediaScreen = newScreen

      if (onresize) onresize.call(this, oldScreen, newScreen)
    }, 200))
  }

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

  // Глобальные методы
  _initMethods(methods: MethodList): void {
    if (!methods) return

    const methodsKeys = Object.keys(methods)
    if (!methodsKeys.length) return

    methodsKeys.forEach(key => {
      if (this[key]) {
        console.error(`Method ${key} already exist`)
      }

      this[key] = methods[key]
    })
  }
}
