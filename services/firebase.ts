// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4qjjWepX-4SN8a2NH4TY-EhOZcr3K2Ac",
  authDomain: "agenda-barber.firebaseapp.com",
  projectId: "agenda-barber",
  storageBucket: "agenda-barber.appspot.com",
  messagingSenderId: "902105140343",
  appId: "1:902105140343:web:67cf8e13fad8b547c24a72",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };
