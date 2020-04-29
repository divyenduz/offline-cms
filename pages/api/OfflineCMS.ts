import os from 'os'

import cheerio from 'cheerio'
import prettier from 'prettier'
import { CSSManager } from './CSSManager'

export class OfflineCMS {
  private readonly $: CheerioStatic

  constructor(content: string) {
    this.$ = cheerio.load(content)
  }

  prettify() {
    return prettier.format(this.getContent(), {
      parser: 'html',
    })
  }

  editBody(newBody) {
    const $ = this._getClone() // Clone it
    $('body').html(newBody)
    return new OfflineCMS($.html())
  }

  getStyles() {
    const style = this.$('style')
      .map((_, el) => {
        return this.$(el).html()
      })
      .get()
      .join(os.EOL)

    const cssManager = new CSSManager(style)
    return cssManager.getCSS()
  }

  getShell() {
    const $ = this._getClone() // Clone it
    $('body').html('')
    return $.html()
  }

  getBody() {
    return this.$('body').html()
  }

  getContent() {
    return this.$.html()
  }

  private _getClone() {
    return cheerio.load(this.$.html())
  }
}
