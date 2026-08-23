import App, { AppConfig } from '@/app/App'

const app = new App({
  components: {},

  methods: {
    initScrollBehavior() {
      const html = document.querySelector('html')

      if (!html) return

      setTimeout(() => {
        html.style.scrollBehavior = 'smooth'
      }, 500)
    },

    initHeadroom() {
      // const header = document.querySelector('#header')
      // const options = { offset: 10 }
      // this.headroom = new Headroom(header, options)
      // this.headroom.init()
    },
  },

  created() {},

  onresize(_oldScreen: string, _newScreen: string) {},

  onload(this: App) {
    const initHeadroom = this['initHeadroom'] as (() => void) | undefined
    const initScrollBehavior = this['initScrollBehavior'] as (() => void) | undefined

    initHeadroom?.()
    initScrollBehavior?.()
  },
} as AppConfig)
