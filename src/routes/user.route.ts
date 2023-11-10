import express from 'express';
import { 
    getProfile,
    setResiAdd,
    setUpAcc,
    BvnVerification,
    generateQr,
    confirmPin

} from '../controllers/user.controller'
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/getprofile', getProfile)

router.put('/setaddress/:id', setResiAdd)

router.put('/setaccount/:id', setUpAcc)

router.post('/setupBvn', BvnVerification)

router.post('/generateqr', generateQr)

router.post('/confirmpin', confirmPin)


export default router;

