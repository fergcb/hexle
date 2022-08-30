export type Observer<T> = (value: T) => void

export default class Observable<T> {
  constructor (
    private readonly observers: Map<string, Observer<T>> = new Map(),
  ) {}

  subscribe (id: string, observer: Observer<T>): void {
    this.observers.set(id, observer)
  }

  broadcast (value: T): void {
    this.observers.forEach(observer => observer.apply(this, [value]))
  }
}
