import { Router } from 'express';
import { authController } from '@/controllers';

const route: Router = Router({
  mergeParams: true,
});

route.route('/sign-up').post(authController.signUp);
route.route('/verify').post(authController.verify);
route.route('/login').post(authController.login);
route.route('/forgetPassword').post(authController.forgotPassword);
route.route('/resetPassword').post(authController.resetPassword);

export const router = route;
