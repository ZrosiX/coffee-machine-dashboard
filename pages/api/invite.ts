import { NextApiRequest, NextApiResponse } from 'next'

export default function RedirectApi (req: NextApiRequest, res: NextApiResponse) {
  const url = new URL('/api/oauth2/authorize', 'https://discord.com')

  url.searchParams.set('client_id', process.env.OAUTH_CLIENT_ID)
  url.searchParams.set('redirect_uri', process.env.OAUTH_REDIRECT_URI + '/dash')
  url.searchParams.set('scope', 'bot applications.commands')

  if (req.query.guild && !Array.isArray(req.query.guild)) {
    url.searchParams.set('guild_id', req.query.guild)
    url.searchParams.set('disable_guild_select', 'true')
  }

  res.redirect(url.toString())
}
