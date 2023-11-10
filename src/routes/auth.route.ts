import express from 'express';
import { 
    signUp,
    verify,
    login,
    resendVerification,
    forgotPassword,
    resetPassword,
    logOut

} from '../controllers/auth.controller'
const router = express.Router();

router.post('/signup', signUp)

router.post('/verify', verify)

router.post('/login', login)

router.post('/resendverification', resendVerification)

router.post('/forgotpassword', forgotPassword)

router.post('/resetpassword', resetPassword)

router.post('/logout', logOut)


export default router;