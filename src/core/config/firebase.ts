import * as firebaseAdmin from 'firebase-admin';
import * as serviceAccount from '@/core/config/serviceAccountKey.json';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount as firebaseAdmin.ServiceAccount),
});

const firebaseMessaging = firebaseAdmin.messaging();

export default firebaseMessaging;
