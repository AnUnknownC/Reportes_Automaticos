// Genera un error de codigo http personalizado (solo flexeo la verdad 0 necesario pero x por si quieres aprender)
export class AppError extends Error {
    statusCode: number // como que necesita que declaren si o si para que el compliador no se rompa waos
    
    constructor(message: string, statusCode = 500) {
        super(message)
        this.statusCode = statusCode
        this.name = 'AppError'
    }
}