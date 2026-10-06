import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQdUNKKwXifVm2prfU6Ekk1_b4RE1fhHE",
  authDomain: "brewcoff-80dcd.firebaseapp.com",
  projectId: "brewcoff-80dcd",
  storageBucket: "brewcoff-80dcd.firebasestorage.app",
  messagingSenderId: "975832058659",
  appId: "1:975832058659:web:0db3f8c80aeb6bb14eda96",
  measurementId: "G-87D9Q9K60L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);