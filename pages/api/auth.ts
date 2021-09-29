import { sign } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const BASE_URL = 'https://discord.com/api/v8/'

export default async function AuthApi (req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  const resp = await fetch(`${BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Coffee-Machine (via Next.js)'
    },
    body:
      `client_id=${process.env.OAUTH_CLIENT_ID}&` +
      `client_secret=${process.env.OAUTH_CLIENT_SECRET}&` +
      'grant_type=authorization_code&' +
      `redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URI + '/callback')}&` +
      `code=${code}`
  }).then((res) => res.json())

  if (!resp.access_token) return res.send({ success: false })

  const user = await fetch(`${BASE_URL}/users/@me`, {
    headers: {
      Authorization: `Bearer ${resp.access_token}`,
      'User-Agent': 'Coffee-Machine (via Next.js)'
    },
    method: 'GET'
  }).then((res) => res.json())

  const token = sign({
    avatar: `/avatars/${user.id}/${user.avatar}.png`,
    tag: `${user.username}#${user.discriminator}`,
    exp: Date.now() + resp.expires_in,
    iat: Date.now(),
    token: resp.access_token
  }, process.env.JWT_SECRET)

  res.send({ success: true, token })
}
