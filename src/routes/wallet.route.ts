import express from 'express';
import { 
    getWallet,
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

router.get('/getwallet', getWallet)

router.post('/sendmoney', sendMoneyToUser)

router.put('/fundwalbank', fundWalletBanktransfer)

router.post('/fundwalcard', fundWalletCard)

router.post('/withdraw', withdrawFundsHandler)

router.post('/request', requestFunds)

router.post('/trasnfertobank', transferToBankFromWalletHandler)

export default router;