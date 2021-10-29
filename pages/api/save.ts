import { JwtPayload } from 'jsonwebtoken'
import knex from 'knex'
import { NextApiRequest, NextApiResponse } from 'next'
import { guildsPool } from '../../pools/guilds'
import { verifyJWT } from '../../utils/jwt'

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'coffee',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'coffee'
  }
})

const BASE_URL = 'https://discord.com/api/v8/'
const { RESTAPI_HOST, RESTAPI_PORT } = process.env

export default async function saveAPI (req: NextApiRequest, res: NextApiResponse) {
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

  if (req.method === 'POST') {
    const { channelId, guildId, videoURL } = req.body
    if (!channelId || !guildId || !videoURL) {
      return res.status(400).send({ success: false, message: 'Missing required fields' })
    }

    if (!guild.filter((g) => g.id === guildId && g.permissions & 0x10)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const [isExist] = await db.select('*').from('brews').where({ guildId })

    if (!isExist) await db.insert({ channelId, guildId, videoURL }).into('brews')
    else await db.update({ channelId, videoURL }).from('brews').where({ guildId })

    await fetch(`http://${RESTAPI_HOST}:${RESTAPI_PORT}/guild/${guildId}`, { method: 'POST' })

    res.send({ success: true })

    return
  }

  if (req.method === 'DELETE') {
    const { guildId } = req.body

    if (!guild.filter((g) => g.id === guildId && g.permissions & 0x10)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    await db.delete().from('brews').where({ guildId })
    await fetch(`http://${RESTAPI_HOST}:${RESTAPI_PORT}/guild/${guildId}`, { method: 'POST' })
    res.send({ success: true })

    return
  }

  if (!guild.filter((g) => g.id === req.query.guild && g.permissions & 0x10)) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }

  res.send((await db.select('*').from('brews').where('guildId', req.query.guild))[0] || {})
}
