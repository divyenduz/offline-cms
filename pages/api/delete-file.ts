import fs from 'fs'
import path from 'path'

import { NextApiRequest, NextApiResponse } from 'next'

const workingDirectory = process.cwd()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name } = req.body
    const filePath = path.join(workingDirectory, name)
    fs.unlinkSync(filePath)
    res.status(200).json({ message: 'Done' })
  } else {
    res.status(200).json({ message: 'Method not supported' })
  }
}
