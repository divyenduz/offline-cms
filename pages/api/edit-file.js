//@ts-check

import fs from 'fs'
import path from 'path'

import cheerio from 'cheerio'
import prettier from 'prettier'

const workingDirectory = process.cwd()

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, content } = req.body
    const filePath = path.join(workingDirectory, name)
    const existingContent = fs.readFileSync(filePath, 'utf8')
    const $ = cheerio.load(existingContent)
    $('body').html(content)
    const newContent = prettier.format($.html(), {
      parser: 'html',
    })
    fs.writeFileSync(filePath, newContent)
    res.status(200).json({ message: 'Done' })
  } else {
    res.status(200).json({ message: 'Method not supported' })
  }
}
