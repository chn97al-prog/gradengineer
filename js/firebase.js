// Firebase Configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// إعدادات مشروع Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDzl2S9fwW2HYvyPbGPOA4UtRyh6A3aDNE",
  authDomain: "gradengineer-d8d10.firebaseapp.com",
  projectId: "gradengineer-d8d10",
  storageBucket: "gradengineer-d8d10.firebasestorage.app",
  messagingSenderId: "615252407862",
  appId: "1:615252407862:web:3486ca69663a31d5bdca97",
  measurementId: "G-ZD1EJW0FZ8"
};

// تشغيل Firebase
const app = initializeApp(firebaseConfig);

// نظام تسجيل الدخول
export const auth = getAuth(app);
