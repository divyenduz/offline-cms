import os from 'os'

import cheerio from 'cheerio'
import prettier from 'prettier'

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
    console.log(newBody)
    $('body').html(newBody)
    return new OfflineCMS($.html())
  }

  getStyles() {
    return this.$('style')
      .map((_, el) => {
        return this.$(el).html()
      })
      .get()
      .join(os.EOL)
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
