import express from 'express';
import { 
    getAllCategories,
    validateBill
} from '../controllers/bills.controller'

import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/allcategories', getAllCategories)

router.post('/validatebill/:item_code', validateBill)

// router.put('/fundwalbank', fundWalletBanktransfer)

// router.post('/fundwalcard', fundWalletCard)

// router.post('/withdraw', withdrawFundsHandler)

// router.post('/request', requestFunds)

// router.post('/trasnfertobank', transferToBankFromWalletHandler)

export default router;