import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCncsPDN3B8ZC8BW0LSPYkbqwW3ULa6nFc",
  authDomain: "inventory-management-sys-926f2.firebaseapp.com",
  projectId: "inventory-management-sys-926f2",
  storageBucket: "inventory-management-sys-926f2.appspot.com",
  messagingSenderId: "699067043828",
  appId: "1:699067043828:web:0ace8f537a1741e616b3a1",
  measurementId: "G-QL8HFMNXME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };