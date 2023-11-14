import express from 'express';
import { 
    getAllCategories
} from '../controllers/bills.controller'

import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.post('/allcategories', getAllCategories)

// router.post('/sendmoney', sendMoneyToUser)

// router.put('/fundwalbank', fundWalletBanktransfer)

// router.post('/fundwalcard', fundWalletCard)

// router.post('/withdraw', withdrawFundsHandler)

// router.post('/request', requestFunds)

// router.post('/trasnfertobank', transferToBankFromWalletHandler)

export default router;