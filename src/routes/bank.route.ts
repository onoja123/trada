import express from 'express';
import { 
    getUserBanks,
    addBank,
    verifyBank,
} from '../controllers/bank.controller'

import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/allbanks', getUserBanks)

router.post('/sendmoney', addBank)

router.post('/verifyacc',  verifyBank)

export default router;