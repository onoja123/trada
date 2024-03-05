import { Router } from 'express';
import { notificationController } from '../controllers';
import auth from '../middlewares/authMiddleware';

const route: Router = Router({
    mergeParams: true,
});

route.route('').post(auth, notificationController.getNotifications);
route.route('/:notificationId').put(auth, notificationController.markNotificationAsRead);

export const router = route;
