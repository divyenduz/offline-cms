import { identityTag as html } from 'identity-tag'
import { OfflineCMS } from './OfflineCMS'

const content = html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Future</title>
      <style>
        .one {
          display: block;
        }
      </style>
      <style>
        .two {
          display: block;
        }
      </style>
    </head>
    <body>
      <ul>
        <li>
          Publish offline-cms to
          <a href="https://github.com/divyenduz/offline-cms">Github</a> ✅
        </li>
        <li>Publish offline-cms tweet</li>
      </ul>
    </body>
  </html>
`

describe('offline cms', () => {
  it('should return the shell', () => {
    const offlineCMS = new OfflineCMS(content)
    expect(offlineCMS.getShell()).toMatchSnapshot()
  })

  it('should return the body', () => {
    const offlineCMS = new OfflineCMS(content)
    expect(offlineCMS.getBody()).toMatchSnapshot()
  })

  it('should return the content', () => {
    const offlineCMS = new OfflineCMS(content)
    expect(offlineCMS.getContent()).toMatchSnapshot()
  })

  it('should edit the body', () => {
    const offlineCMS = new OfflineCMS(content)
    expect(offlineCMS.editBody('<p>Hello</p>').getContent()).toMatchSnapshot()
  })

  it('should prettify', () => {
    const offlineCMS = new OfflineCMS(content)
    expect(offlineCMS.prettify()).toMatchSnapshot()
  })

  it('should prettify after edit', () => {
    const offlineCMS = new OfflineCMS(content)
    expect(offlineCMS.editBody('<p>Hello</p>').prettify()).toMatchSnapshot()
  })

  it('should get styles', () => {
    const offlineCMS = new OfflineCMS(content)
    expect(offlineCMS.getStyles()).toMatchSnapshot()
  })
})
