// app/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Pegue essas infos no Firebase Console > Configurações do Projeto > Seu app > SDK

const firebaseConfig = {
  apiKey: "Insira",
  authDomain: "Insira",
  projectId: "Insira",
  storageBucket: "Insira",
  messagingSenderId: "Insira",
  appId: "Insira",
  measurementId: "Insira",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
