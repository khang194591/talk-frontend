import { child, onChildAdded, push, set, update } from "firebase/database";
import { store } from "../app";
import { dbRef } from "../plugins/firebase/database";

const participantRef = child(dbRef, "participants");

const createAnswer = async (userId: string, receiverId: string) => {
  const pc = store.getState().meeting.participants[receiverId].pc;

  if (pc) {
    const receiverRef = child(participantRef, receiverId);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        push(child(receiverRef, "answerCandidates"), {
          ...event.candidate.toJSON(),
          userId,
        });
      }
    };

    const description = await pc.createAnswer();
    await pc.setLocalDescription(description);

    const answer = {
      sdp: description.sdp,
      type: description.type,
      userId: userId,
    };

    await set(push(child(receiverRef, "answers")), { answer });
  }
};

export const updatePreference = (
  userId: string,
  preference: Partial<{
    audio: boolean;
    video: boolean;
    screen: boolean;
  }>
) => {
  const currentParticipantRef = child(
    child(participantRef, userId),
    "preferences"
  );
  setTimeout(() => {
    update(currentParticipantRef, preference);
  });
};

export const createOffer = async (
  pc: RTCPeerConnection,
  userId: string,
  receiverId: string
) => {
  const receiverRef = child(participantRef, receiverId);
  const description = await pc.createOffer();

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      push(child(receiverRef, "offerCandidates"), {
        ...event.candidate.toJSON(),
        userId: userId,
      });
    }
  };

  await pc.setLocalDescription(description);

  const offer = {
    sdp: description.sdp,
    type: description.type,
    userId: userId,
  };
  await set(push(child(receiverRef, "offers")), { offer });
};

export const initializeListeners = (userId: string) => {
  const userRef = child(participantRef, userId);

  onChildAdded(child(userRef, "offers"), async (snapshot) => {
    const data = snapshot.val();
    if (data.offer) {
      const pc = store.getState().meeting.participants[data.offer.userId].pc;
      await pc?.setRemoteDescription(new RTCSessionDescription(data.offer));
      await createAnswer(userId, data.offer.userId);
    }
  });

  onChildAdded(child(userRef, "offerCandidates"), async (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = store.getState().meeting.participants[data.userId].pc;
      await pc?.addIceCandidate(new RTCIceCandidate(data));
    }
  });

  onChildAdded(child(userRef, "answers"), async (snapshot) => {
    const data = snapshot.val();
    if (data.answer) {
      const pc = store.getState().meeting.participants[data.answer.userId].pc;
      const answerDescription = new RTCSessionDescription(data.answer);
      await pc?.setRemoteDescription(answerDescription);
    }
  });

  onChildAdded(child(userRef, "answerCandidates"), async (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = store.getState().meeting.participants[data.userId].pc;
      await pc?.addIceCandidate(new RTCIceCandidate(data));
    }
  });
};
