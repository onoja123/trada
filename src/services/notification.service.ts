import { INotification, NotiResponse } from "@/interfaces";
import Notification from "@/models/notification";
import User from "@/models/user";
import { BadRequestException } from "@/exceptions";

export class NotificationService {
    public async getNotifications(userId: string): Promise<NotiResponse> {
        const user = await User.findById(userId);

        if (!user) {
            throw new BadRequestException('User not found.');
        }

        const notifications = await Notification.find({ user: user._id })
            .sort({ createdAt: -1 });

        const count = notifications.length;

        return {
            notifications,
            count,
        };
    }

    public async markAsRead(notificationId: string): Promise<INotification> {
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            throw new BadRequestException('Notification not found.');
        }

        notification.view = true;
        const savedNotification = await notification.save();

        return savedNotification;
    }
}
