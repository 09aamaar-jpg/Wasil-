/**
 * ملف مرجعي جاهز لربط Firebase Authentication و Firestore مستقبلاً.
 * ملاحظة: التطبيق يعمل حالياً بالتخزين المحلي (Local Persistence) فقط،
 * ولا يرسل أو يخزن أي بيانات سحابية بعد.
 *
 * عند التفعيل:
 * 1. ثبّت الحزمة: npm install firebase
 * 2. أنشئ ملف .env.local وأضف متغيرات VITE_FIREBASE_*
 * 3. فعّل الكود أدناه واربط dataRepository.ts بـ Firestore
 */

export const firebaseEnvConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseEnvConfig.apiKey && firebaseEnvConfig.projectId
);

/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseEnvConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
*/
