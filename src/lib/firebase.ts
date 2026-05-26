import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLb9gfPn8K2F66F3YFcgtASnY7gv7Xj1Q",
  authDomain: "mydeliveri.firebaseapp.com",
  projectId: "mydeliveri",
  storageBucket: "mydeliveri.firebasestorage.app",
  messagingSenderId: "898725641697",
  appId: "1:898725641697:web:383dbf4902ebd7b11fe6a0",
  measurementId: "G-C9DSZQJPP7"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Firestore persistence failed: multiple tabs open");
  } else if (err.code === "unimplemented") {
    console.warn("Firestore persistence not available in this browser");
  }
});

export default app;
