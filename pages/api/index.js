//@ts-check

import fs from 'fs'
import path from 'path'
import os from 'os'

import glob from 'glob'

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
      return {
        name: f,
        content: fs.readFileSync(f, 'utf8'),
      }
    })
  res.status(200).json({ files })
}
