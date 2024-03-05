import { NextFunction, Request, Response, Router } from 'express';
import { router as UserRouter } from './user.route';
import { router as AuthRouter } from './auth.route';
import { router as WalletRouter } from './wallet.route';
import { router as TransactionRoute } from './transaction.route';
import { router as BankRoute } from './bank.route';
import { router as BillRoute } from './bill.route';
import { router as NotificationRoute } from './notification.route';
import { router as RequestRoute } from './request.route';

const route: Router = Router({
  mergeParams: true,
});

route.use(function (req: Request, res: Response, next: NextFunction) {
  res.setHeader('Api-Version', 'v1');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

route.route('/health-check').get(function (req: Request, res: Response) {
  return res.status(200).json({ healthy: true, version: 'v1' });
});

route.use('/user', UserRouter);
route.use('/auth', AuthRouter);
route.use('/wallet', WalletRouter);
route.use('/bank', BankRoute);
route.use('/transaction', TransactionRoute);
route.use('/bill', BillRoute);
route.use('/notification', NotificationRoute);
route.use('/request', RequestRoute);

export const router = route;
