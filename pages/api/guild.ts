import { JwtPayload } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { guildsPool } from '../../pools/guilds'
import { verifyJWT } from '../../utils/jwt'

const BASE_URL = 'https://discord.com/api/v8/'

export default async function GuildApi (req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers

  if (!authorization) return res.status(401).json({ success: false, error: 'Unauthorized' })
  const payload = verifyJWT(authorization, process.env.JWT_SECRET!) as JwtPayload

  if (!payload) return res.status(401).json({ success: false, error: 'Unauthorized' })
  const { token, tag } = payload

  const cached = guildsPool.get(tag)
  const guild = cached || await fetch(`${BASE_URL}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Coffee-Machine (via Next.js)'
    },
    method: 'GET'
  }).then((res) => res.json())

  if (!Array.isArray(guild)) return res.send({ success: false, error: 'Invalid guild data' })

  if (!cached) guildsPool.set(tag, guild.filter((g) => g.permissions & 0x10))
  return res.send({ success: true, guild: guild.filter((g) => g.permissions & 0x10) })
}
