import { useMemo } from "react";
import { useAppSelector } from "@/app";
import { MeetingParticipant } from ".";

export function MeetingParticipantGrid() {
  const { participants } = useAppSelector((state) => state.meeting);

  const size = useMemo<{ x: number; y: number }>(() => {
    const len = Object.keys(participants).length;
    return len === 1
      ? { x: 1, y: 1 }
      : len === 2
      ? { x: 1, y: 2 }
      : len < 5
      ? { x: 2, y: 2 }
      : len < 10
      ? { x: 3, y: 3 }
      : { x: 4, y: 4 };
  }, [participants]);
  return (
    <div
      className={`flex-1 w-full grid grid-rows-${size.x} grid-cols-${size.y} p-4 gap-2`}
    >
      {Object.entries(participants).map(([key, participant]) => (
        <MeetingParticipant key={key} participant={participant} />
      ))}
    </div>
  );
}
