import { JwtPayload } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { guildsPool } from '../../pools/guilds'
import { verifyJWT } from '../../utils/jwt'

const BASE_URL = 'https://discord.com/api/v8/'
const { RESTAPI_HOST, RESTAPI_PORT } = process.env

export default async function ChannelApi (req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers
  const { guild } = req.query

  if (!guild) return res.send({ success: false, error: 'No guild specified' })
  if (!authorization) return res.status(401).json({ success: false, error: 'Unauthorized' })
  const payload = verifyJWT(authorization, process.env.JWT_SECRET!) as JwtPayload

  if (!payload) return res.status(401).json({ success: false, error: 'Unauthorized' })
  const { token, tag } = payload

  const cached = guildsPool.get(tag)
  const guildData = cached || await fetch(`${BASE_URL}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Coffee-Machine (via Next.js)'
    },
    method: 'GET'
  }).then((res) => res.json())

  if (!Array.isArray(guildData)) return res.send({ success: false, error: 'Invalid guild data' })
  if (!cached) guildsPool.set(tag, guildData.filter((g) => g.permissions & 0x10))

  const targetGuild = guildData.find((g) => g.id === guild)
  if (!(targetGuild.permissions & 0x10)) {
    return res.status(403).json({ success: false, error: 'Insufficient permissions' })
  }

  const channels = await fetch(`http://${RESTAPI_HOST}:${RESTAPI_PORT}/guild/${guild}`)
    .then((res) => res.json())

  return res.send({ success: true, channels })
}
