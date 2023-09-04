import { useAppSelector } from "../app";
import Participant from "./Participant";

export default function ParticipantGrid() {
  const { participants } = useAppSelector((state) => state.room);
  return (
    <div className="flex-1 w-full grid grid-cols-4 grid-rows-2 p-4 gap-2">
      {Object.entries(participants).map(([key, participant]) => (
        <Participant key={key} participant={participant} />
      ))}
    </div>
  );
}
