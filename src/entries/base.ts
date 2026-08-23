import App from '@/app/App'

class MyApp extends App {
  initScrollBehavior(): void {
    const html = document.querySelector('html')

    if (!html) return

    setTimeout(() => {
      html.style.scrollBehavior = 'smooth'
    }, 500)
  }

  initHeadroom(): void {
    // const header = document.querySelector('#header')
    // const options = { offset: 10 }
    // this.headroom = new Headroom(header, options)
    // this.headroom.init()
  }

  onload(): void {
    this.initHeadroom()
    this.initScrollBehavior()
  }
}

const app = new MyApp({
  components: {},
})
