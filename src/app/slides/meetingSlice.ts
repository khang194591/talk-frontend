import {
  createOffer,
  initializeListeners,
  updatePreference,
} from "@/utils/peerConnection";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type UserPreferences = {
  audio: boolean;
  video: boolean;
  screen: boolean;
};

export type UserOptions = {
  pc?: RTCPeerConnection;
  name: string;
  current?: boolean;
} & UserPreferences;

export type UserStream = {
  stream: MediaStream;
};

export interface State {
  currentUser: Record<string, UserOptions>;
  participants: Record<string, UserOptions>;
  stream: MediaStream;
}

export const rtcConfig: RTCConfiguration = {
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

export const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Record<string, UserOptions>>) => {
      initializeListeners(Object.keys(action.payload)[0]);
      state.currentUser = action.payload;
    },
    setUserStream: (state, action: PayloadAction<MediaStream>) => {
      state.stream = action.payload;
    },
    addParticipant: (
      state,
      action: PayloadAction<Record<string, UserOptions>>
    ) => {
      const cuKey = Object.keys(state.currentUser)[0];
      const nuKey = Object.keys(action.payload)[0];
      if (state.stream && cuKey !== nuKey) {
        action.payload = addConnection(
          state.currentUser,
          action.payload,
          state.stream
        );
      }
      if (cuKey === nuKey) {
        action.payload[nuKey].current = true;
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
    updateUser: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      const userId = Object.keys(state.currentUser)[0];
      updatePreference(userId, action.payload);
      state.currentUser[userId] = {
        ...state.currentUser[userId],
        ...action.payload,
      };
    },
    updateParticipant: (
      state,
      action: PayloadAction<Record<string, UserOptions>>
    ) => {
      const userId = Object.keys(action.payload)[0];
      action.payload[userId] = {
        ...state.participants[userId],
        ...action.payload[userId],
      };
      state.participants = { ...state.participants, ...action.payload };
    },
  },
});

const addConnection = (
  cu: Record<string, UserOptions>,
  nu: Record<string, UserOptions>,
  stream: MediaStream
) => {
  const pc = new RTCPeerConnection(rtcConfig);
  stream.getTracks().forEach((track) => {
    pc.addTrack(track, stream);
  });

  const cuKey = Object.keys(cu)[0];
  const nuKey = Object.keys(nu)[0];

  nu[nuKey].pc = pc;

  const sortedKeys = [cuKey, nuKey].sort((a, b) => a.localeCompare(b));
  if (sortedKeys[1] === cuKey) {
    createOffer(pc, sortedKeys[1], sortedKeys[0]);
  }
  return nu;
};

export const {
  setUser,
  setUserStream,
  addParticipant,
  removeParticipant,
  updateUser,
  updateParticipant,
} = meetingSlice.actions;
