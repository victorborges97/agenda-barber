// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const apiKey = process.env.NEXT_APIKEY;
const authDomain = process.env.NEXT_AUTHDOMAIN;
const projectId = process.env.NEXT_PROJECTID;
const storageBucket = process.env.NEXT_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_APP_ID;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

const firebaseConfig2 = {
  apiKey: "AIzaSyB4qjjWepX-4SN8a2NH4TY-EhOZcr3K2Ac",
  authDomain: "agenda-barber.firebaseapp.com",
  projectId: "agenda-barber",
  storageBucket: "agenda-barber.appspot.com",
  messagingSenderId: "902105140343",
  appId: "1:902105140343:web:67cf8e13fad8b547c24a72",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig2);
const db = getFirestore(firebaseApp);

export { db };
