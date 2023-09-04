import { configureStore } from "@reduxjs/toolkit";
import { roomSlice } from "./slides/roomSlice";

export const store = configureStore({
  reducer: {
    room: roomSlice.reducer,
  },
  middleware: (getDefaultMiddeware) =>
    getDefaultMiddeware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
