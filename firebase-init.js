// Import functions from the Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics, logEvent, screenView } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    addDoc, 
    updateDoc, 
    increment, 
    runTransaction, 
    onSnapshot, 
    serverTimestamp, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Your web app's Firebase configuration
// (استخدمت الإعدادات التي أرسلتها في رسالتك الأولى)
const firebaseConfig = {
    apiKey: "AIzaSyAvmDYPrRWrogOJX_KPykMv4ePzZ74ZkAY", // <-- لقد أخفيت جزءاً منه للأمان، استخدم مفتاحك الكامل
    authDomain: "aziz-store-e27ee.firebaseapp.com",
    projectId: "aziz-store-e27ee",
    storageBucket: "aziz-store-e27ee.firebasestorage.app",
    messagingSenderId: "695156879159",
    appId: "1:695156879159:web:afb49eb2dcea5b6d5534b2",
    measurementId: "G-MRK0Q0JG3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app); // تهيئة المصادقة

// تسجيل دخول المستخدمين كمجهولين
// هذا ضروري للسماح لهم بكتابة التعليقات بأمان.
let currentUserId = null;
signInAnonymously(auth)
  .catch((error) => {
    console.error("Error signing in anonymously:", error);
  });

// مراقبة حالة المصادقة
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    console.log("User is signed in with UID:", currentUserId);
  } else {
    currentUserId = null;
  }
});


// تصدير كل الوحدات التي سنحتاجها في الملفات الأخرى
export { 
  db, 
  analytics,
  auth,
  currentUserId,
  logEvent,
  screenView,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc,
  updateDoc,
  increment,
  runTransaction,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
};
