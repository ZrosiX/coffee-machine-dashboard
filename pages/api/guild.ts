import { JwtPayload, verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const BASE_URL = 'https://discord.com/api/v8/'

export default async function GuildApi (req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers

  if (!authorization) return res.status(401).json({ success: false, error: 'Unauthorized' })
  const { token } = verify(authorization, process.env.JWT_SECRET!) as JwtPayload

  const guild = await fetch(`${BASE_URL}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Coffee-Machine (via Next.js)'
    },
    method: 'GET'
  }).then((res) => res.json())

  return res.send({ success: true, guild: guild.filter((g) => g.permissions & 0x10) })
}
