export interface TruthyObject {
  [key: string]: unknown
}

export function truthyValues(obj: TruthyObject): TruthyObject {
  const falsyValues: unknown[] = [undefined, null, false, 0]

  return Object.entries(obj).reduce<TruthyObject>(
    (a, [k, v]) => (falsyValues.includes(v) ? a : ((a[k] = v), a)),
    {}
  )
}

export function getCustomPropertyValue(el: HTMLElement, name: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim()
}
