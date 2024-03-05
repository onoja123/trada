import { MessagingTopicManagementResponse } from 'firebase-admin/lib/messaging/messaging-api';
import firebaseMessaging from '../config/firebase';
import User from '../../models/user';
import { Notification, NotificationResponse } from '../../enums/notifications';

export const sendAllNotificationService = async (
  notification: Notification,
  title: string = notification.title,
  body: string = notification.body
): Promise<NotificationResponse> => {
  try {
    const users = await User.find({ token: { $ne: '' } });

    const registrationTokens = users.map(user => user.token);

    if (registrationTokens.length === 0) {
      throw new Error('No tokens found');
    }

    const message = {
      notification: {
        icon: "https://flowday.net/favicon.ico",
        title,
        body
      },
      tokens: registrationTokens
    };

    const response = await firebaseMessaging.sendEachForMulticast(message);

    return response;
  } catch (error: any) {
    throw new Error(error?.message || "Internal server error!");
  }
};

export const sendNotificationToTokenService = async (
  token: string,
  notification: Notification,
  title: string = notification.title,
  body: string = notification.body
): Promise<string> => {
  try {
    const message = {
      data: {},
      notification: {
        icon: "https://flowday.net/favicon.ico",
        title,
        body,
      },
      android: {
        priority: 'high' as const,
        notification: {
          priority: 'high' as const,
          color: '#009FE3',
        },
      },
      token,
    };

    const response = await firebaseMessaging.send(message);

    return response;
  } catch (error: any) {
    throw new Error(error?.message || `Internal server error !`);
  }
};

export const sendNotificationToTopicService = async (topic: string, notification: Notification): Promise<string> => {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      topic,
    };

    const response = await firebaseMessaging.send(message);

    return response;
  } catch (error: any) {
    throw new Error(error?.message || `Internal server error !`);
  }
};

export const subscribeToTopicService = async (token: string, topic: string): Promise<MessagingTopicManagementResponse> => {
  try {
    const response = await firebaseMessaging.subscribeToTopic(token, topic);
    return response;
  } catch (error: any) {
    throw new Error(error?.message || `Internal server error !`);
  }
};

export const unSubscribeToTopicService = async (token: string, topic: string): Promise<MessagingTopicManagementResponse> => {
  try {
    const response = await firebaseMessaging.unsubscribeFromTopic(token, topic);
    return response;
  } catch (error: any) {
    throw new Error(error?.message || `Internal server error !`);
  }
};
