//@ts-check

import fs from 'fs'
import path from 'path'

const workingDirectory = `/Users/divyendusingh/Documents/zoid/likecsdegree.com`

export default (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  const files = fs
    .readdirSync(workingDirectory)
    .filter((f) => f.endsWith('.html')) // TODO: Sub-folder support
    .filter((f) => {
      const filePath = path.join(workingDirectory, f)
      return !fs.statSync(filePath).isDirectory()
    })
    .map((f) => {
      const filePath = path.join(workingDirectory, f)
      return {
        name: f,
        content: fs.readFileSync(filePath, 'utf8'),
      }
    })
  res.status(200).json({ files })
}
