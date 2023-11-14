import express from 'express';
import { 
    createWallet,
    sendMoneyToUser,
    fundWalletBanktransfer,
    fundWalletCard,
    withdrawFundsHandler,
    requestFunds,
    transferToBankFromWalletHandler,
} from '../controllers/wallet.controller'

import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.post('/createwallet', createWallet)

router.post('/sendmoney', sendMoneyToUser)

router.put('/fundwalbank', fundWalletBanktransfer)

router.post('/fundwalcard', fundWalletCard)

router.post('/withdraw', withdrawFundsHandler)

router.post('/request', requestFunds)

router.post('/trasnfertobank', transferToBankFromWalletHandler)

export default router;