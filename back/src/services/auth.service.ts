// services/auth.service.ts
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase'
import { AppError } from '../utils/appError'

const SALT_ROUNDS = 12
export const PLAN_LIMITS: Record<string, number> = { 
    free: 5, 
    pro: 20, 
    enterprise: Infinity 
}

interface RegisterInput {
    name: string
    email: string
    password: string
}

interface Agency {
    id: string
    email: string
    plan: string
}

export async function registerAgency({ name, email, password }: RegisterInput) {
    const { data: existing } = await supabase
        .from('agencies').select('id').eq('email', email).single()
    if (existing) throw new AppError('Email ya registrado', 409)

    const hashed = await bcrypt.hash(password, SALT_ROUNDS)

    const { data: agency, error } = await supabase
        .from('agencies')
        .insert({ name, email, password: hashed, plan: 'free' })
        .select('id, email, plan').single()
    if (error) throw new AppError(error.message, 500)

    return { agency, token: signToken(agency) }
}

export async function loginAgency({ email, password }: Omit<RegisterInput, 'name'>) {
    const { data: agency } = await supabase
        .from('agencies').select('id, email, plan, password').eq('email', email).single()
    if (!agency) throw new AppError('Credenciales inválidas', 401)

    const match = await bcrypt.compare(password, agency.password)
    if (!match) throw new AppError('Credenciales inválidas', 401)

    const { password: _, ...safe } = agency
    return { agency: safe, token: signToken(safe) }
}

function signToken(agency: Agency) {
    return jwt.sign(
        { agency_id: agency.id, plan: agency.plan },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    )
}