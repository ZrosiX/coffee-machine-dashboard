import { JwtPayload, verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const BASE_URL = 'https://discord.com/api/v8/'

export default async function ChannelApi (req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers
  const { guild } = req.query

  if (!guild) return res.send({ success: false, error: 'No guild specified' })
  if (!authorization) return res.status(401).json({ success: false, error: 'Unauthorized' })
  const { token } = verify(authorization, process.env.JWT_SECRET!) as JwtPayload

  const channels = await fetch(`${BASE_URL}/guilds/${guild}/channels`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Coffee-Machine (via Next.js)'
    },
    method: 'GET'
  }).then((res) => res.json())

  return res.send({ success: true, channels })
}
