import { Request, Response } from 'express'
import { oauth2Client, SCOPES } from '../config/google'
import { supabase } from '../config/supabase'

export function connectGoogle(req: Request, res: Response) {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: req.agency?.agency_id
  })
  res.json({ url })
}

export async function googleCallback(req: Request, res: Response) {
  const { code, state: agency_id } = req.query
  console.log('callback recibido', { code, agency_id })

  try {
    const { tokens } = await oauth2Client.getToken(code as string)
    console.log('tokens obtenidos', tokens)

    const { error } = await supabase
    .from('integrations')
    .insert({
        agency_id: agency_id,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(tokens.expiry_date!).toISOString(),
    })

    console.log('error supabase', error)

    if (error) throw error

    res.redirect('http://localhost:5173/dashboard?connected=true')
  } catch (err) {
    console.log('error en callback', err)
    res.redirect('http://localhost:5173/dashboard?error=google_auth_failed')
  }
}