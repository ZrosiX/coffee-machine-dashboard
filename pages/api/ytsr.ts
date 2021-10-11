import { NextApiRequest, NextApiResponse } from 'next'
import ytsr from 'ytsr'

export default async function YtsrApi (req: NextApiRequest, res: NextApiResponse) {
  const { input } = req.query
  if (!input || Array.isArray(input)) return res.send({ success: false, message: 'No input' })

  const result = await ytsr(input, { limit: 30 })
  res.send({ success: true, result: result.items })
}
