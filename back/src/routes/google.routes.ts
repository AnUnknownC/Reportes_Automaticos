import { Router } from 'express'
import { connectGoogle, googleCallback } from '../controllers/google.controllers'
import { verifyJWT } from '../middlewares/verifyJWT'

const router = Router()

router.get('/connect', verifyJWT, connectGoogle)
router.get('/callback', googleCallback)

export default router