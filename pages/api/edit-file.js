//@ts-check

import fs from 'fs'
import path from 'path'

import { OfflineCMS } from './OfflineCMS'

const workingDirectory = process.cwd()

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, content } = req.body
    const filePath = path.join(workingDirectory, name)
    const existingContent = fs.readFileSync(filePath, 'utf8')

    const offlineCMS = new OfflineCMS(existingContent).editBody(content)

    fs.writeFileSync(filePath, offlineCMS.prettify())
    res.status(200).json({ message: 'Done' })
  } else {
    res.status(200).json({ message: 'Method not supported' })
  }
}
