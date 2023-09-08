import {
  UserPreferences,
  addParticipant,
  removeParticipant,
  setUser,
  setUserStream,
  updateParticipant,
} from "@/app/slides/meetingSlice";
import { connectedRef, dbRef, name } from "@/plugins/firebase/database";
import {
  child,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onDisconnect,
  onValue,
  push,
} from "firebase/database";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app";
import { Meeting } from "./meeting";

export default function Home() {
  const participantRef = child(dbRef, "participants");

  const { currentUser, stream } = useAppSelector((state) => state.meeting);
  const dispatch = useAppDispatch();

  const isUserSet = !!currentUser;
  const isStreamSet = !!stream;

  useEffect(() => {
    const preferences: UserPreferences = {
      video: true,
      audio: false,
      screen: false,
    };

    navigator.mediaDevices.getUserMedia(preferences).then((stream) => {
      dispatch(setUserStream(stream));
    });

    onValue(connectedRef, (snap) => {
      if (snap.val()) {
        const userRef = push(participantRef, {
          name,
          preferences,
        });
        if (userRef.key) {
          dispatch(
            setUser({
              [userRef.key]: {
                name,
                ...preferences,
              },
            })
          );
        }
        onDisconnect(userRef).remove();
      }
    });

    return () => {};
  }, []);

  useEffect(() => {
    if (isStreamSet && isUserSet) {
      onChildAdded(participantRef, (snap) => {
        if (snap.key) {
          const preferenceUpdateEvent = child(
            child(participantRef, snap.key),
            "preferences"
          );
          onChildChanged(preferenceUpdateEvent, (preferenceSnap) => {
            if (snap.key && preferenceSnap.key) {
              console.log({
                [snap.key]: {
                  [preferenceSnap.key]: preferenceSnap.val(),
                },
              });

              dispatch(
                updateParticipant({
                  [snap.key]: {
                    [preferenceSnap.key]: preferenceSnap.val(),
                  },
                } as unknown as any)
              );
            }
          });
          const { name, preferences } = snap.val();
          dispatch(
            addParticipant({
              [snap.key]: {
                name,
                ...preferences,
              },
            })
          );
        }
      });

      onChildRemoved(participantRef, (snap) =>
        dispatch(removeParticipant(snap.key))
      );
    }
  }, [isStreamSet, isUserSet]);

  return <Meeting />;
}
