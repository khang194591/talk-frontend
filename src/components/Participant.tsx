import { IconMicrophone, IconMicrophoneOff } from "@tabler/icons-react";
import React, { useEffect, useRef } from "react";
import { UserOptions } from "../app/slides/roomSlice";
import { useAppSelector } from "../app";

type Props = {
  participant: UserOptions;
};

export default function Participant({ participant }: Props) {
  const mainStream = useAppSelector((state) => state.room.mainStream);

  const videoRef = useRef<HTMLVideoElement>(null);

  const remoteStream = new MediaStream();

  useEffect(() => {
    if (participant.peerConnection) {
      participant.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
        }
      };
    }

    return () => {};
  }, [participant.peerConnection, remoteStream]);

  useEffect(() => {
    if (mainStream && participant.isCurrent) {
      if (videoRef.current) {
        videoRef.current.srcObject = mainStream;
      }
    }

    return () => {};
  }, [participant.isCurrent, mainStream]);

  return (
    <div className="min-h-[16rem] relative flex items-center justify-center border rounded-lg">
      {/* {!participant.peerConnection ? (
        <span className="h-24 w-24 flex items-center justify-center text-white bg-black rounded-full">
          {participant.username.at(0)?.toUpperCase()}
        </span>
      ) : ( */}
      <video ref={videoRef} autoPlay playsInline className=""></video>
      {/* )} */}
      <span className="absolute right-4 top-2">
        {participant.isCurrent ? <IconMicrophone /> : <IconMicrophoneOff />}
      </span>
      <span className="absolute left-4 bottom-2">
        {participant.username}
        {participant.isCurrent && " (YOU)"}
      </span>
    </div>
  );
}
