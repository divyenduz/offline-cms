#!/usr/bin/env node

//@ts-check
const { createServer } = require('http')
const next = require('next')
const open = require('open')
const { parse } = require('url')

const dir = __dirname
const { PORT = 1338 } = process.env

const dev = process.env.NODE_ENV !== 'production'

//@ts-ignore
const app = next({ dev, dir })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname.startsWith('/api')) {
        handle(req, res)
      } else {
        app.render(req, res, '/', query)
      }
    })

    server.listen(PORT, async (err) => {
      if (err) throw err

      const url = `http://localhost:${PORT}`

      console.log(`offline-cms started on ${url}`)
      open(url, { url: true })
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
