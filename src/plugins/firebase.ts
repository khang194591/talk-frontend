// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDg_WZSH3JruYrLsZLewiqZBkqhE5pRMyg",
  authDomain: "talk-194591.firebaseapp.com",
  projectId: "talk-194591",
  storageBucket: "talk-194591.appspot.com",
  messagingSenderId: "606811115966",
  appId: "1:606811115966:web:8d37334c4b94449eca69ef",
};

export const app = initializeApp(firebaseConfig);

export const pc = new RTCPeerConnection({
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
});

export const db = getFirestore(app);
