import { z } from 'zod';
import { successResponse } from '../utils/response'
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/appError'
import * as AuthService from '../services/auth.service';

const registerSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
});

export async function register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    try {
        const result = await AuthService.registerAgency(parsed.data);
        successResponse(res, result, 'Agencia registrada correctamente', 201)
    } catch (err) {
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({ error: err.message })
        }
        res.status(500).json({ error: 'Error interno' })
    }   
}

export async function login(req: Request, res: Response) {
    try {
        const result = await AuthService.loginAgency(req.body);
        successResponse(res, result, 'Agencia logueada correctamentee', 201)
    } catch (err) {
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({ error: err.message })
        }
        res.status(500).json({ error: 'Error interno' })
    }
}