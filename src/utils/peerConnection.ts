import { child, onChildAdded, push, set } from "firebase/database";
import { dbRef } from "../plugins/firebase/database";
import { store } from "../app";

const participantRef = child(dbRef, "participants");

export const createOffer = async (
  peerConnection: RTCPeerConnection,
  createdId: string,
  receiverId: string
) => {
  const receiverRef = child(participantRef, receiverId);
  const offerDescription = await peerConnection.createOffer();

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      push(child(receiverRef, "offerCandidates"), {
        ...event.candidate.toJSON(),
        userId: createdId,
      });
    }
  };

  await peerConnection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
    userId: createdId,
  };
  await set(push(child(receiverRef, "offers")), { offer });
};

export const initListeners = (userId: string) => {
  const userRef = child(participantRef, userId);

  onChildAdded(child(userRef, "offers"), async (snapshot) => {
    const data = snapshot.val();
    if (data?.offer) {
      const peerConnection =
        store.getState().room.participants[data.offer.userId].peerConnection;
      await peerConnection?.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      await createAnswer(userId, data.offer.userId);
    }
  });

  onChildAdded(child(userRef, "offerCandidates"), async (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const peerConnection =
        store.getState().room.participants[data.userId].peerConnection;
      await peerConnection?.addIceCandidate(new RTCIceCandidate(data));
    }
  });

  onChildAdded(child(userRef, "answers"), async (snapshot) => {
    const data = snapshot.val();
    if (data.answer) {
      const peerConnection =
        store.getState().room.participants[data.answer.userId].peerConnection;
      const answerDescription = new RTCSessionDescription(data.answer);
      await peerConnection?.setRemoteDescription(answerDescription);
    }
  });

  onChildAdded(child(userRef, "answerCandidates"), async (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const peerConnection =
        store.getState().room.participants[data.userId].peerConnection;
      await peerConnection?.addIceCandidate(new RTCIceCandidate(data));
    }
  });
};

const createAnswer = async (userId: string, receiverId: string) => {
  const peerConnection =
    store.getState().room.participants[receiverId].peerConnection;

  if (peerConnection) {
    const receiverRef = child(participantRef, receiverId);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        push(child(receiverRef, "answerCandidates"), {
          ...event.candidate.toJSON(),
          userId,
        });
      }
    };

    const answerDescription = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDescription);

    const answer = {
      sdp: answerDescription.sdp,
      type: answerDescription.type,
      userId: userId,
    };

    await set(push(child(receiverRef, "answers")), { answer });
  }
};
