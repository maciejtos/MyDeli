import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import app from "./firebase";

export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Firestore persistence failed: multiple tabs open");
  } else if (err.code === "unimplemented") {
    console.warn("Firestore persistence not available in this browser");
  }
});
