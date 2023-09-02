import { ref, set, onDisconnect } from "firebase/database";
import { auth, realtimeDatabase } from "./firebaseConfig";

const setUserOnline = (userUid) => {
    const userStatusRef = ref(realtimeDatabase, `userStatus/${userUid}`);
    set(userStatusRef, true);

    // Set up an onDisconnect handler to set user status to false when they disconnect
    onDisconnect(userStatusRef).set(false);
};

const setUserOffline = (userUid) => {
    const userStatusRef = ref(realtimeDatabase, `userStatus/${userUid}`);
    set(userStatusRef, false);
};

export { setUserOnline, setUserOffline };
