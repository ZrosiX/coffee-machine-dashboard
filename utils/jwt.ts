import { JwtPayload, verify } from 'jsonwebtoken'

export function verifyJWT (token: string, secret: string): JwtPayload | undefined {
  try {
    return verify(token, secret) as JwtPayload
  } catch (err) {
    return undefined
  }
}
