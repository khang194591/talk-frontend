import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createOffer, initListeners } from "../../utils/peerConnection";

export type UserOptions = {
  username: string;
  constraints: MediaStreamConstraints;
  isCurrent?: boolean;
  peerConnection?: RTCPeerConnection;
};

export type UserStream = {
  mainStream: MediaStream;
};

interface State {
  currentUser: { [key: string]: UserOptions };
  participants: Record<string, UserOptions>;
  mainStream: MediaStream;
}

const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

const initialState: State = {
  participants: {},
} as State;

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ [key: string]: UserOptions }>) => {
      initListeners(Object.keys(action.payload)[0]);
      state.currentUser = action.payload;
    },
    setUserStream: (state, action: PayloadAction<MediaStream>) => {
      state.mainStream = action.payload;
    },
    addParticipant: (
      state,
      action: PayloadAction<{ [key: string]: UserOptions }>
    ) => {
      try {
        const cuKey = Object.keys(state.currentUser)[0] ?? "0";
        const nuKey = Object.keys(action.payload)[0] ?? "00";
        if (state.mainStream && cuKey !== nuKey) {
          addConnection(state.currentUser, action.payload, state.mainStream);
        }
        if (cuKey === nuKey) {
          action.payload[nuKey].isCurrent = true;
        }
      } catch (error) {
        action.payload[Object.keys(action.payload)[0]].isCurrent = true;
      }
      state.participants = { ...state.participants, ...action.payload };
    },
    removeParticipant: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        const participants = { ...state.participants };
        delete participants[action.payload];
        state.participants = participants;
      }
    },
  },
});

const addConnection = (
  currentUser: Record<string, UserOptions>,
  newUser: Record<string, UserOptions>,
  mediaStream: MediaStream
) => {
  const peerConnection = new RTCPeerConnection(rtcConfig);
  mediaStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, mediaStream);
  });

  const cuKey = Object.keys(currentUser)[0];
  const nuKey = Object.keys(newUser)[0];

  const sortedKeys = [cuKey, nuKey].sort((a, b) => a.localeCompare(b));

  newUser[nuKey].peerConnection = peerConnection;

  if (sortedKeys[1] === cuKey) {
    createOffer(peerConnection, sortedKeys[1], sortedKeys[0]);
  }
};

export const { setUser, setUserStream, addParticipant, removeParticipant } =
  roomSlice.actions;
