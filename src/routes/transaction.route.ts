import { Router } from 'express';
import { transactionController } from '../controllers';
import auth from '../middlewares/authMiddleware';

const route: Router = Router({
  mergeParams: true,
});

route.route('/:transactionId').get(auth, transactionController.getTransaction);
route.route('').get(auth, transactionController.getTransactions);
route.route('/all').get(transactionController.getAllTransactions);

export const router = route;
