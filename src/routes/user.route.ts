import express from 'express';
import { NextFunction, Request, Response } from 'express';
import { 
    getProfile,
    setResiAdd,
    setUpAcc,
    InitiateBvnVerification,
    verifyAndCreateAccount,
    generateQr,
    setupPin,
    changePin,
    confirmPin
} from '../controllers/user.controller'
import { verifyWebhookSignature } from '../middleware/webhook.signature';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/getprofile', getProfile)

router.put('/setaddress/:id', setResiAdd)

router.put('/setaccount/:id', setUpAcc)

router.post('/setupBvn', InitiateBvnVerification)

router.post('/generateqr', generateQr)

router.post('/setuppin', setupPin)

router.post('/changepin', changePin)

router.post('/confirmpin', confirmPin)

// Webhook signature verification middleware
router.use('/', verifyWebhookSignature);

router.post('/verifyandgen', verifyAndCreateAccount)

export default router;

