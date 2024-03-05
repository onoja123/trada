import { Router } from 'express';
import { requestController } from '../controllers';
import auth from '../middlewares/authMiddleware';

const route: Router = Router({
    mergeParams: true,
});

route.route('').post(auth, requestController.requestFunds);
route.route('/approve/:requestId').put(auth, requestController.approveRequest);
route.route('/decline/:requestId').patch(auth, requestController.declineRequest);

export const router = route;
