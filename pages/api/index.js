//@ts-check

import fs from 'fs'
import path from 'path'
import os from 'os'

import glob from 'glob'
import { OfflineCMS } from './OfflineCMS'

const workingDirectory = process.cwd()

export default async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  let ignoresFromGitIgnore = []
  const gitIgnoreFilePath = path.join(workingDirectory, '.gitignore')
  if (fs.existsSync(gitIgnoreFilePath)) {
    ignoresFromGitIgnore = fs
      .readFileSync(gitIgnoreFilePath, 'utf8')
      .split(os.EOL)
      .map((l) => l.trim())
      .filter((l) => l.endsWith('/'))
  }

  const ignoreGlob = ignoresFromGitIgnore.map((i) => i + '**')

  // TODO: Don't get all files' content in one go
  const files = glob
    .sync('**/*.html', {
      ignore: ignoreGlob,
    })
    // TODO: This sort migth be expensive
    .sort((a, b) => a.split('/').length - b.split('/').length)
    .map((f) => {
      const content = fs.readFileSync(f, 'utf8')
      const offlineCMS = new OfflineCMS(content)

      return {
        name: f,
        styles: offlineCMS.getStyles(),
        content: offlineCMS.getBody(),
      }
    })
  res.status(200).json({ files })
}
