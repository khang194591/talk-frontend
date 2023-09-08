import { useAppSelector } from "@/app";
import { UserOptions } from "@/app/slides/meetingSlice";
import { cn } from "@/lib/utils";
import { IconMicrophone, IconMicrophoneOff } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

type Props = {
  participant: UserOptions;
};

export function MeetingParticipant({ participant }: Props) {
  const { currentUser, stream } = useAppSelector((state) => state.meeting);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (participant.pc) {
      const remoteStream = new MediaStream();
      participant.pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
        }
      };
    }

    return () => {};
  }, [participant.pc]);

  useEffect(() => {
    if (stream && participant.current) {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    return () => {};
  }, [participant, stream]);

  return (
    <div className="relative flex items-center justify-center bg-foreground text-background border rounded-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={cn(
          participant.current &&
            !currentUser[Object.keys(currentUser)[0]].screen &&
            "-scale-x-100",
          "max-h-full h-full w-fit"
        )}
      ></video>
      <span className="absolute right-4 top-2">
        {participant.current ? <IconMicrophone /> : <IconMicrophoneOff />}
      </span>
      <span className="absolute left-4 bottom-2">
        {participant.name}
        {participant.current && " (YOU)"}
      </span>
    </div>
  );
}
