import { Router } from 'express';
import auth from '../middlewares/authMiddleware';
import { userController } from '../controllers';

const route: Router = Router({ mergeParams: true });

route.route('/address/:userId').put(auth, userController.setUpAddress);
route.route('/account/:userId').put(auth, userController.setUpAccount);
route.route('/bvn/:userId').post(auth, userController.initiateBvnVerification);
route.route('/verifyandgen').post(auth, userController.verifyAndCreateAccount);
route.route('/me').get(auth, userController.getUser);
route.route('/users').get(userController.getUsers);
route.route('/avatar').put(auth, userController.updateAvatar);
route.route('/changePassword').put(auth, userController.changePassword);

export const router = route;
