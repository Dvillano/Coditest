import { ref, get, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { realtimeDatabase } from "./firebaseConfig";

export function useRealtimeDb(path) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const dbRef = ref(realtimeDatabase, path);

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    setData(snapshot.val());
                } else {
                    setData(null);
                }
                setIsLoading(false);
            } catch (error) {
                console.error(
                    "Error fetching data from Realtime Database:",
                    error
                );
                setIsLoading(false);
            }
        };

        fetchData();

        // Set up a Realtime Database listener to update data in real-time
        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                setData(snapshot.val());
            } else {
                setData(null);
            }
        });

        return () => {
            // Clean up the listener when the component unmounts
            unsubscribe();
        };
    }, [path]);

    return { data, isLoading };
}
