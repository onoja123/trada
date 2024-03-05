import { Router } from 'express';
import { walletController } from '../controllers';
import auth from '../middlewares/authMiddleware';

const route: Router = Router({
  mergeParams: true,
});

route.route('/:userId').get(auth, walletController.getBalance);
route.route('/pin/:userId').put(auth, walletController.setWalletPin);
route.route('/changePin/:userId').patch(auth, walletController.changePin);
route.route('/forgetPin').post(auth, walletController.forgetTransactionPin);
route.route('/resetPin/:userId').patch(auth, walletController.resetTransactionPin);
route.route('/send-money').post(auth, walletController.sendMoneyToUser);
route.route('/qr-pay').post(auth, walletController.makeQrPayment);
route.route('/transfer').post(auth, walletController.transferToBank);

export const router = route;
