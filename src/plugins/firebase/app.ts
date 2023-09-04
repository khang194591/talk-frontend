import { FirebaseOptions, initializeApp } from "firebase/app";

const config: FirebaseOptions = {
  apiKey: "AIzaSyDg_WZSH3JruYrLsZLewiqZBkqhE5pRMyg",
  authDomain: "talk-194591.firebaseapp.com",
  projectId: "talk-194591",
  storageBucket: "talk-194591.appspot.com",
  messagingSenderId: "606811115966",
  appId: "1:606811115966:web:8d37334c4b94449eca69ef",
  databaseURL:
    "https://talk-194591-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

export const app = initializeApp(config);
