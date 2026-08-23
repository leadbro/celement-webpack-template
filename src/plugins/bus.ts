interface EventBusNode extends Comment {
  on(eventName: string, callback: EventListenerOrEventListenerObject): void
  trigger(eventName: string, params?: unknown): void
}

function initBus(): EventBusNode {
  const bus = new Comment('event-bus') as EventBusNode

  // Обёртка над addEventListener
  bus.on = function (eventName: string, callback: EventListenerOrEventListenerObject) {
    this.addEventListener(eventName, callback)
  }

  // Зарегистрировать событие
  bus.trigger = function (eventName: string, params?: unknown) {
    this.dispatchEvent(
      new CustomEvent(eventName, { detail: params })
    )
  }

  return bus
}

export default class Bus {
  private bus: EventBusNode

  constructor() {
    this.bus = initBus()
  }

  on(eventName: string, callback: EventListenerOrEventListenerObject): void {
    this.bus.on(eventName, callback)
  }

  trigger(eventName: string, params?: unknown): void {
    this.bus.trigger(eventName, params)
  }
}
