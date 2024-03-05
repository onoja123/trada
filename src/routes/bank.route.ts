import { Router } from 'express';
import { beneficiaryController } from '../controllers';
import auth from '../middlewares/authMiddleware';

const route: Router = Router({
  mergeParams: true,
});

route.route('').post(auth, beneficiaryController.addBank);
route.route('/:accountId').put(auth, beneficiaryController.editBank);
route.route('/:accountId').delete(beneficiaryController.deleteBank);
route.route('').get(beneficiaryController.getUserBanks);
route.route('/banks').get(beneficiaryController.getBanks);

export const router = route;
