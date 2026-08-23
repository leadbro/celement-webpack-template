import { TruthyObject, truthyValues } from '@/utils/object'
import { unsafeHTML } from 'lit-html/directives/unsafe-html'

interface DataToInterpolate {
  [key: string]: string
}

export function inlineClasses(rawClasses: TruthyObject = {}): string {
  const activeClasses = truthyValues(rawClasses)
  const classes = Object.keys(activeClasses)

  return classes.join(' ')
}

export function interpolate(template: string, data: DataToInterpolate): string {
  const names = Object.keys(data)
  const vals = Object.values(data)
  return new Function(...names, `return \`${template}\`;`)(...vals)
}

export function renderTemplate(template: HTMLElement, data: DataToInterpolate) {
  const templateContent = unsafeHTML(interpolate(template.innerHTML, data))
  return templateContent
}
