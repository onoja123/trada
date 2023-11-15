import express from 'express';
import { 
    getAlltransactions,
    getOneTransaction
} from '../controllers/transactions.controller'

import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/alltransactions', getAlltransactions)

router.get('/onetransaction/:id', getOneTransaction)

export default router;