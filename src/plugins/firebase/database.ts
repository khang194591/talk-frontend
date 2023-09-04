import { child, getDatabase, push, ref } from "firebase/database";
import { app } from ".";

let dbRef = ref(getDatabase(app));

const connectedRef = ref(getDatabase(app), ".info/connected");

const username = prompt("What's your name?") ?? "Anoy";

const urlparams = new URLSearchParams(window.location.search);
const roomId = urlparams.get("id");

if (roomId) {
  dbRef = child(dbRef, roomId);
} else {
  dbRef = push(dbRef);
  window.history.replaceState(null, "Meet", "?id=" + dbRef.key);
}

export { dbRef, connectedRef, username };
