import { IconCamera, IconMicrophone } from "@tabler/icons-react";
import { Button } from "antd";
import {
  child,
  onChildAdded,
  onChildRemoved,
  onDisconnect,
  onValue,
  push,
} from "firebase/database";
import { useEffect } from "react";
import { useAppDispatch } from "../app";
import {
  addParticipant,
  removeParticipant,
  setUser,
  setUserStream,
} from "../app/slides/roomSlice";
import { connectedRef, dbRef, username } from "../plugins/firebase/database";
import ParticipantGrid from "./ParticipantGrid";
export default function Home() {
  const participantRef = child(dbRef, "participants");

  const dispatch = useAppDispatch();

  useEffect(() => {
    const constraints: MediaStreamConstraints = {
      video: true,
      audio: false,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      dispatch(setUserStream(stream));
    });

    onValue(connectedRef, (snap) => {
      if (snap.val()) {
        const userRef = push(participantRef, {
          username,
          constraints,
        });
        if (userRef.key) {
          dispatch(
            setUser({
              [userRef.key]: {
                username,
                constraints,
              },
            })
          );
        }
        onDisconnect(userRef).remove();
      }
    });

    onChildAdded(participantRef, (snap) => {
      if (snap.key) {
        const { username, constraints } = snap.val();
        dispatch(
          addParticipant({
            [snap.key]: {
              username,
              constraints,
            },
          })
        );
      }
    });

    onChildRemoved(participantRef, (snap) =>
      dispatch(removeParticipant(snap.key))
    );

    return () => {};
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center divide-y">
      <ParticipantGrid />
      <div className="px-4 py-3 w-full flex items-center justify-center gap-2">
        <Button size="large" shape="circle">
          <IconMicrophone strokeWidth={1.5} />
        </Button>
        <Button size="large" shape="circle">
          <IconCamera strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
}
