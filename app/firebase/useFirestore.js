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

            // Busca problemas no resueltos del mismo nivel para el usuario
            const userNivel = userSnapshot.data().nivel;
            const passedProblems = await fetchUserProgress(userId);
            const problemsQuery = query(
                collection(db, "problemas"),
                where("nivel", "==", userNivel),
                where("id", "not-in", passedProblems)
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

    const saveResults = async (userId, problemId, status) => {
        const resultData = {
            usuario_id: userId,
            problema_id: problemId,
            resultado: status,
            fecha: new Date().toLocaleString(),
        };

        try {
            const resultRef = doc(collection(db, "resultados"));
            await setDoc(resultRef, resultData);
        } catch (error) {
            console.error("Error saving results:", error);
        }
    };

    /**
     * Fetches the user's progress from the "progresoUsuario" collection in the database.
     *
     * @param {string} userId - The ID of the user.
     * @return {Array} An array of the problems the user has approved, or an empty array if the user has no progress.
     */
    const fetchUserProgress = async (userId) => {
        try {
            const userProgressRef = doc(db, "progresoUsuario", userId);
            const userProgressSnapshot = await getDoc(userProgressRef);
            return userProgressSnapshot.exists()
                ? userProgressSnapshot.data().problemasAprobados
                : [];
        } catch (error) {
            console.error("Error fetching user progress:", error);
            return [];
        }
    };

    const updatePassedProblems = async (userId, problemId) => {
        try {
            const userProgressRef = doc(db, "progresoUsuario", userId);
            const userProgressSnapshot = await getDoc(userProgressRef);

            if (userProgressSnapshot.exists()) {
                const problemasAprobados =
                    userProgressSnapshot.data().problemasAprobados;
                problemasAprobados.push(problemId);
                await setDoc(
                    userProgressRef,
                    { problemasAprobados },
                    { merge: true }
                );
            } else {
                await setDoc(userProgressRef, {
                    problemasAprobados: [problemId],
                });
            }
        } catch (error) {
            console.error("Error updating user progress:", error);
        }
    };

    return {
        isLoading,
        insertUser,
        fetchAssignedProblems,
        saveResults,
        updatePassedProblems,
    };
};
