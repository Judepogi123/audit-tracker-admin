import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  orderBy,where,collection,
  query as fQuery,
  limit,
  getDocs,
  startAfter as fStartAfter,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  get,
  set,
  ref,
  push,
  update,
  onValue,
  off,
  remove,
  query as dbQuery,
  limitToLast,
  limitToFirst,
  orderByKey,
  startAfter,
  orderByChild,
  equalTo,
  startAt,endAt
} from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes,getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.FIREBASE_DATABASE_URL,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID,
  measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export {
  get,
  set,
  ref,
  push,
  remove,
  update,
  onValue,
  dbQuery,
  limitToLast,
  limitToFirst,
  orderByKey,
  orderByChild,
  startAfter,
  startAt,
  endAt,
  equalTo,
  off,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  orderBy,
  fStartAfter,
  where,
  storageRef,
  uploadBytes,
  collection,
  fQuery,
  limit,
  getDownloadURL,
  deleteDoc
};
