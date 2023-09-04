import { getFirestore } from "firebase/firestore";
import { app } from "./app";

export const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const firestore = getFirestore(app);
