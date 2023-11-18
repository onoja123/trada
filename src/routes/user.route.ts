import express from 'express';
import { 
    getProfile,
    setResiAdd,
    setUpAcc,
    InititateBvnVerification,
    verifyUserBvn,
    generateQr,
    setupPin,
    changePin,
    confirmPin

} from '../controllers/user.controller'
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/getprofile', getProfile)

router.put('/setaddress/:id', setResiAdd)

router.put('/setaccount/:id', setUpAcc)

router.post('/setupBvn', InititateBvnVerification)

router.post('/verifybvn/:reference', verifyUserBvn)

router.post('/generateqr', generateQr)

router.post('/setuppin', setupPin)

router.post('/changepin', changePin)

router.post('/confirmpin', confirmPin)



export default router;

