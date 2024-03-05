import { NextFunction, Request, Response } from 'express';
import { jsonOne, jsonAll } from '@/core/utils/response';
import { NotificationService } from '@/services/notification.service';

const notification = new NotificationService();

const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const notifications = await notification.getNotifications(userId);

        return jsonAll(res, 200, notifications);
    } catch (error) {
        next(error);
    }
};

const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { notificationId } = req.params;
        const markedNotification = await notification.markAsRead(notificationId);

        return jsonOne(res, 200, markedNotification);
    } catch (error) {
        next(error);
    }
};

export default {
    getNotifications,
    markNotificationAsRead,
};
