//@ts-check

import fs from 'fs'
import path from 'path'

import { JSDOM } from 'jsdom'
import prettier from 'prettier'

const workingDirectory = process.cwd()

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, content, isBody } = req.body
    const filePath = path.join(workingDirectory, name)
    if (isBody) {
      const existingContent = fs.readFileSync(filePath, 'utf8')
      let dom = new JSDOM(existingContent)
      const body = dom.window.document.querySelector('body')
      body.innerHTML = content
      const newContent = prettier.format(dom.serialize(), {
        parser: 'html',
      })
      fs.writeFileSync(filePath, newContent)
    } else {
      fs.writeFileSync(filePath, content)
    }

    res.status(200).json({ message: 'Done' })
  } else {
    res.status(200).json({ message: 'Method not supported' })
  }

  const files = fs
    .readdirSync(workingDirectory)
    .filter((f) => f === 'index.html')
    .map((f) => {
      const filePath = path.join(workingDirectory, f)
      return {
        name: f,
        content: fs.readFileSync(filePath, 'utf8'),
      }
    })
  res.end(JSON.stringify({ files }))
}
