import { useAppDispatch, useAppSelector } from "@/app";
import {
  UserOptions,
  setUserStream,
  updateUser,
} from "@/app/slides/meetingSlice";
import {
  IconCamera,
  IconCameraOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconScreenShare,
  IconX,
} from "@tabler/icons-react";
import { Button } from "../ui/button";

export function MeetingFooter() {
  const { currentUser, stream, participants } = useAppSelector(
    (state) => state.meeting
  );
  const dispatch = useAppDispatch();

  const current = currentUser ? Object.values(currentUser)[0] : null;

  const updateStream = (stream: MediaStream) => {
    for (const key in participants) {
      const sender = participants[key] as UserOptions;
      if (sender.current) continue;
      if (sender.pc) {
        const pc = sender.pc
          .getSenders()
          .find((s) => (s.track ? s.track.kind === "video" : false));
        console.log(pc);
        pc?.replaceTrack(stream.getVideoTracks()[0]);
      }
    }
    dispatch(setUserStream(stream));
  };

  const onMicroClick = (enabled: boolean) => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = enabled;
      dispatch(updateUser({ audio: enabled }));
    }
  };
  const onVideoClick = (enabled: boolean) => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = enabled;
      dispatch(updateUser({ video: enabled }));
    }
  };
  const onScreenClick = async () => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    mediaStream.getVideoTracks()[0].onended = onScreenShareEnd;
    updateStream(mediaStream);
    dispatch(updateUser({ screen: true }));
  };

  const onScreenShareEnd = async () => {
    stream.getTracks().forEach((track) => track.stop());
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    localStream.getVideoTracks()[0].enabled =
      Object.values(currentUser)[0].video;
    updateStream(localStream);
    dispatch(updateUser({ screen: false }));
  };
  return (
    <div className="px-4 py-3 w-full flex items-center justify-center gap-2">
      <Button
        variant={current?.audio ? "default" : "destructive"}
        size="icon"
        onClick={() => onMicroClick(!current?.audio)}
      >
        {current?.audio ? <IconMicrophone /> : <IconMicrophoneOff />}
      </Button>
      <Button
        variant={current?.video ? "default" : "destructive"}
        size="icon"
        onClick={() => onVideoClick(!current?.video)}
      >
        {current?.video ? <IconCamera /> : <IconCameraOff />}
      </Button>
      <Button
        variant={current?.screen ? "destructive" : "default"}
        size="icon"
        onClick={() => (current?.screen ? onScreenShareEnd() : onScreenClick())}
      >
        {current?.screen ? <IconX /> : <IconScreenShare />}
      </Button>
    </div>
  );
}
