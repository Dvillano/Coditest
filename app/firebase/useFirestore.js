import { useState } from "react";
import {
    doc,
    getDoc,
    query,
    where,
    collection,
    setDoc,
    getDocs,
    orderBy,
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

    const fetchUser = async (userId) => {
        try {
            const userRef = doc(db, "usuarios", userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                return userData;
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    };

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, "usuarios");
            const usersSnapshot = await getDocs(usersCollection);

            if (!usersSnapshot.empty) {
                const usersData = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                return usersData;
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Function to fetch user activity logs
    const fetchUserActivityLogs = async () => {
        try {
            const logsQuery = query(
                collection(db, "logs"),
                orderBy("timestamp", "desc")
            );
            const logsSnapshot = await getDocs(logsQuery);

            const activityLogs = logsSnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });

            return activityLogs;
        } catch (error) {
            console.error("Error fetching user activity logs:", error);
            return [];
        }
    };

    // Function to fetch the total number of problems
    const fetchTotalProblemsCount = async () => {
        try {
            const problemsQuery = collection(db, "problemas");
            const problemsSnapshot = await getDocs(problemsQuery);

            return problemsSnapshot.size; // Total number of problems
        } catch (error) {
            console.error("Error fetching total problems count:", error);
            return 0;
        }
    };

    // Function to fetch the total number of users
    const fetchTotalUsersCount = async () => {
        try {
            const usersQuery = collection(db, "usuarios");
            const usersSnapshot = await getDocs(usersQuery);
            return usersSnapshot.size; // Total number of users
        } catch (error) {
            console.error("Error fetching total users count:", error);
            return 0;
        }
    };

    return {
        isLoading,
        insertUser,
        fetchAssignedProblems,
        saveResults,
        updatePassedProblems,
        fetchUser,
        fetchUsers,
        fetchUserActivityLogs,
        fetchTotalProblemsCount,
        fetchTotalUsersCount,
    };
};
