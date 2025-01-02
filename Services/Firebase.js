// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  initializeAuth, getReactNativePersistence, getAuth, updateProfile } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfAmY_6_d1v52LpV4xEY6eJ8eRCKcDHvc",
  authDomain: "carbide-haven-418116.firebaseapp.com",
  projectId: "carbide-haven-418116",
  storageBucket: "carbide-haven-418116.appspot.com",
  messagingSenderId: "515481729094",
  appId: "1:515481729094:android:593b43c18a3ca116993247",
  measurementId: "G-31YGV7BBEP"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const updateUserProfile = (user, data) => {
  updateProfile(user, data);
}