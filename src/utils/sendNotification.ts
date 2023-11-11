import admin from 'firebase-admin'
/**
 *
 * @param {String} deviceToken this is the Device ID For the push notification
 * @param {String} title this is the title of the push notification
 * @param {String} message This is the body of the push notification `MAX 500`,
 * @param {String} image This is the image title for the fcm , If not specefic uses a default image `OPTIONAL`
 * @returns Suceess Message (`Use in an Async Function`)
 */
export const sendNotification = async(deviceToken: string, title: string, message: string, image: string): Promise<string> => {
    const payload = {
        notification: {
            title: title,
            body: message
        },
        token: deviceToken
    }
    const value = await admin.messaging().send(payload);
    return value;
}