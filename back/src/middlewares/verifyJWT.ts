// middlewares/verifyJWT.js
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'

interface AgencyPayload {
  agency_id: string
  plan: string
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Sin token' })

  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET as string) as AgencyPayload
    req.agency = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}