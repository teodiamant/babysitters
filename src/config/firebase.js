import {initializeApp} from "firebase/app";
import {browserLocalPersistence} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { initializeAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAyQb5edpSv_0UJwu4Zq99Iw4PIgqLJbHs",
    authDomain: "babysitters-e90ad.firebaseapp.com",
    projectId: "babysitters-e90ad",
    storageBucket: "babysitters-e90ad.firebasestorage.app",
    messagingSenderId: "756736378123",
    appId: "1:756736378123:web:c0fb07ad4ae7e96f364e0e",
    measurementId: "G-1NKHNCQGYW"
  };

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: browserLocalPersistence,
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);