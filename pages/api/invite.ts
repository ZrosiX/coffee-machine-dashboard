import { NextApiRequest, NextApiResponse } from 'next'

export default function RedirectApi (_: NextApiRequest, res: NextApiResponse) {
  const url = new URL('/api/oauth2/authorize', 'https://discord.com')

  url.searchParams.set('client_id', process.env.OAUTH_CLIENT_ID)
  url.searchParams.set('redirect_uri', process.env.OAUTH_REDIRECT_URI + '/dash')
  url.searchParams.set('scope', 'bot applications.commands')

  res.redirect(url.toString())
}
