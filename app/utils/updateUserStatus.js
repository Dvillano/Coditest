import { ref, set, onDisconnect } from "firebase/database";
import { realtimeDatabase } from "../firebase/firebaseConfig";

// Function to update user status to "online" on login
export const updateUserStatusOnLogin = (user) => {
    if (user) {
        const userUid = user.uid;
        const userEmail = user.email;
        const userStatusRef = ref(realtimeDatabase, `userStatus/${userUid}`);

        // Set user status to "online" and update lastOnline timestamp
        set(userStatusRef, {
            email: userEmail,
            status: "online",
            lastOnline: new Date().toLocaleString(),
        });

        // Set up an onDisconnect handler to set user status to "offline" when they disconnect
        onDisconnect(userStatusRef).set({
            email: userEmail,
            status: "offline",
            lastOnline: new Date().toLocaleString(),
        });
    }
};

// Function to update user status to "offline" on logout
export const updateUserStatusOnLogout = (user) => {
    if (user) {
        const userUid = user.uid;
        const userEmail = user.email;

        const userStatusRef = ref(realtimeDatabase, `userStatus/${userUid}`);

        // Set user status to "offline" and update lastOnline timestamp
        set(userStatusRef, {
            email: userEmail,
            status: "offline",
            lastOnline: new Date().toLocaleString(),
        });
    }
};
