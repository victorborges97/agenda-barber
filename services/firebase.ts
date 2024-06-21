// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const apiKey = process.env.NEXT_PUBLIC_APIKEY;
const authDomain = process.env.NEXT_PUBLIC_AUTHDOMAIN;
const projectId = process.env.NEXT_PUBLIC_PROJECTID;
const storageBucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID;
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
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();
const provider = new GoogleAuthProvider();

provider.setCustomParameters({ prompt: "select_account" });

export { db, auth, provider };
