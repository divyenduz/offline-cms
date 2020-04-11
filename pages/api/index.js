//@ts-check

import fs from 'fs'
import path from 'path'

import glob from 'glob'

const workingDirectory = process.cwd()

export default async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  // TODO: Don't get all files' content in one go
  const files = glob
    .sync('**/*.html', {
      ignore: 'node_modules/**',
    })
    // TODO: This sort migth be expensive
    .sort((a, b) => a.split('/').length - b.split('/').length)
    .map((f) => {
      return {
        name: f,
        content: fs.readFileSync(f, 'utf8'),
      }
    })
  res.status(200).json({ files })
}
