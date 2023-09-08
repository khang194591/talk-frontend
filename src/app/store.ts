import { configureStore } from "@reduxjs/toolkit";
import { meetingSlice } from "./slides/meetingSlice";

export const store = configureStore({
  reducer: {
    meeting: meetingSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
