import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDC4mRD_Lygn3QPm2Waz8bpBwtJqy_9VNA",
  authDomain: "adtour-c7e78.firebaseapp.com",
  projectId: "adtour-c7e78",
  storageBucket: "adtour-c7e78.appspot.com",
  messagingSenderId: "542803652815",
  appId: "1:542803652815:web:413b552c54815d29d447ba"
}; // must change this, add web to console

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

