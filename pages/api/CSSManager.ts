import css from 'css'
import { compose } from './utils'

export class CSSManager {
  private parsedStyle: css.Stylesheet

  constructor(style) {
    this.parsedStyle = css.parse(style)
  }

  getCSS() {
    this.process()
    return css.stringify(this.parsedStyle)
  }

  private getClone() {
    return css.parse(css.stringify(this.parsedStyle))
  }

  private process() {
    const parsedStyle = this.getClone()
    parsedStyle.stylesheet.rules = parsedStyle.stylesheet.rules
      .map(CSSManager.mapSelectors)
      .filter((r) => {
        if (CSSManager.isRule(r) && r.selectors?.length === 0) {
          return false
        }
        return true
      })

    this.parsedStyle = parsedStyle
  }

  private static mapSelectors(r: unknown) {
    if (CSSManager.isRule(r)) {
      const selectors = r.selectors || []
      const newSelectors = selectors.map(
        compose(CSSManager.mapBodySelector, CSSManager.mapHTMLSelector),
      )
      r.selectors = newSelectors.filter((s) => Boolean(s))
      return r
    }
    if (CSSManager.isMedia(r)) {
      r.rules = r.rules.map(CSSManager.mapSelectors)
      return r
    }
    return r
  }

  private static isRule(r: css.Node): r is css.Rule {
    return r.type === 'rule'
  }

  private static isMedia(r: css.Node): r is css.Media {
    return r.type === 'media'
  }

  private static mapHTMLSelector(s: string) {
    if (s === 'html') {
      return null
    } else {
      return s
    }
  }

  private static mapBodySelector = (s: string) => {
    if (s === 'body') {
      return '.preview-container'
    } else {
      return s
    }
  }
}
