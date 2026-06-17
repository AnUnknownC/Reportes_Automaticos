//son solo helpers que ayudan a dar respuestas, como un verificador de por medio
//TODAS LAS FUNCIONES de controllers deberian pasar por este helper, nunca se pasa una respuesta json directa

import { Response } from "express";

export const successResponse = (res: Response, data: unknown, message = 'OK', statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data })
}

export const errorResponse = (res: Response, message = 'Error',statusCode = 400 ) => {
    return res.status(statusCode).json({ success: false, message})
}