// ==================================   Firebase   ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyAMAUR5zHjo3NkJv4W0e0KGIxOns323s-I",
    authDomain: "task-saving-app.firebaseapp.com",
    projectId: "task-saving-app",
    storageBucket: "task-saving-app.appspot.com",
    messagingSenderId: "405330741204",
    appId: "1:405330741204:web:aa306f4980c7f30d3e3841",
    measurementId: "G-MCBDLW29RM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);