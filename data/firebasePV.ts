// app/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Pegue essas infos no Firebase Console > Configurações do Projeto > Seu app > SDK

const firebaseConfig = {
  apiKey: "AIzaSyBaO8KTS0fa3LmfAzzwk16ouIWQ1NnQVm8",
  authDomain: "cards-explorasaqua.firebaseapp.com",
  projectId: "cards-explorasaqua",
  storageBucket: "cards-explorasaqua.firebasestorage.app",
  messagingSenderId: "719226046601",
  appId: "1:719226046601:web:ce73b212290a9fc9b11e58",
  measurementId: "G-0Y33DFN8YL",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
