import { ref, get, onValue, off } from "firebase/database";
import { useEffect, useState } from "react";
import { realtimeDatabase } from "./firebaseConfig";
import { useFirebaseAuth } from "./useFirebaseAuth";

export const useUserStatus = () => {
    const [userStatuses, setUserStatuses] = useState([]);
    const { authUser } = useFirebaseAuth();

    useEffect(() => {
        if (!authUser) {
            // Handle the case when the user is not authenticated
            return;
        }

        const userStatusRef = ref(realtimeDatabase, "userStatus");

        // Use the "onValue" function to listen for changes to the entire "userStatus" node
        onValue(userStatusRef, (snapshot) => {
            if (snapshot.exists()) {
                // Convert the snapshot into an object containing user statuses
                const data = snapshot.val();
                const userStatusArray = Object.values(data);

                setUserStatuses(userStatusArray);
            } else {
                // Handle the case when there is no data
                setUserStatuses([]);
            }
        });

        return () => {
            // Unsubscribe from the database listener when the component unmounts
            off(userStatusRef);
        };
    }, [authUser]);

    return userStatuses;
};
