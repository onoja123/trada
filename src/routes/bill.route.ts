import { Router } from 'express';
import { billCotroller } from '../controllers';
import auth from '../middlewares/authMiddleware';

const route: Router = Router({
    mergeParams: true,
});

route.route('/:categoryName').get(auth, billCotroller.getBills);
route.route('/validate').post(auth, billCotroller.validateBill);
route.route('/buy').post(auth, billCotroller.payBill);

export const router = route;
