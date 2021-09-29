import { NextApiRequest, NextApiResponse } from 'next'

export default function RedirectApi (req: NextApiRequest, res: NextApiResponse) {
  const url = new URL('/api/oauth2/authorize', 'https://discord.com')

  url.searchParams.set('client_id', process.env.OAUTH_CLIENT_ID)
  url.searchParams.set('redirect_uri', process.env.OAUTH_REDIRECT_URI + '/callback')
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', process.env.OAUTH_SCOPE)

  if (req.query.state && !Array.isArray(req.query.state)) {
    url.searchParams.set('state', req.query.state)
  }

  res.redirect(url.toString())
}
