import { MeetingFooter, MeetingParticipantGrid } from ".";

export function Meeting() {
  return (
    <div className="h-screen flex flex-col items-center justify-center divide-y">
      <MeetingParticipantGrid />
      <MeetingFooter />
    </div>
  );
}
