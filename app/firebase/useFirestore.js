import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    query,
    where,
    collection,
    setDoc,
    getDocs,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const useFirestore = () => {
    const [isLoading, setIsLoading] = useState(true);

    const insertUser = async (user, userData) => {
        console.log(user, userData);
        const userRef = doc(collection(db, "usuarios"), user.uid);

        try {
            await setDoc(userRef, userData, { merge: true });
        } catch (error) {
            throw new Error("Error storing user info: " + error.message);
        }
    };

    const fetchAssignedProblems = async (userId) => {
        try {
            //Check if the user has assigned problem
            const userRef = doc(db, "usuarios", userId);
            const userSnapshot = await getDoc(userRef);

            if (
                !userSnapshot.exists() ||
                !userSnapshot.data().tienePruebasAsignadas
            ) {
                console.log("User does not have assigned problems");
                return [];
            }

            // Fetch problems with the same nivel as the user
            const userNivel = userSnapshot.data().nivel;
            const problemsQuery = query(
                collection(db, "problemas"),
                where("nivel", "==", userNivel)
            );
            const problemsSnapshot = await getDocs(problemsQuery);

            let problems = problemsSnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });

            // Trae solos 3 problemas ordenados al azar.
            problems.sort(() => {
                return Math.random() - 0.5;
            });

            problems = problems.slice(0, 3);
      
            return problems;
        } catch (error) {
            console.error("Error fetching assigned problems:", error);
            return [];
        }
    };

    return {
        isLoading,
        insertUser,
        fetchAssignedProblems,
    };
};
