import { useState } from "react";
import {
    doc,
    addDoc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    where,
    collection,
    getDocs,
    orderBy,
    limit,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const useFirestore = () => {
    const insertUser = async (user, userData) => {
        const userRef = doc(collection(db, "usuarios"), user.uid);
        const userProgressRef = doc(
            collection(db, "progresoUsuario"),
            user.uid
        );

        let initialUserProgress = {
            problemasAsignados: [],
        };

        try {
            await setDoc(userRef, userData, { merge: true });
            await setDoc(userProgressRef, initialUserProgress, { merge: true }); // Creo progreso al usuario con su uid
        } catch (error) {
            throw new Error("Error storing user info: " + error.message);
        }
    };

    const insertProblem = async (problemData) => {
        const problemasCollectionRef = collection(db, "problemas");

        try {
            const problemasRef = await addDoc(
                problemasCollectionRef,
                problemData
            );

            // Get the auto-generated UID
            const uid = problemasRef.id;

            // Add the UID to the problemData
            problemData.id = uid;

            // Update the document with the UID field
            await setDoc(problemasRef, problemData, { merge: true });

            // Return the updated problemData with the UID
            return { ...problemData, uid };
        } catch (error) {
            throw new Error("Error storing problem info: " + error.message);
        }
    };

    // Editar documento
    const editDocument = async (collectionName, idDoc, data) => {
        const docRef = doc(db, collectionName, idDoc);
        try {
            await setDoc(docRef, data, { merge: true });
        } catch (error) {
            throw new Error(
                "Error al editar informacion del usuario: " + error.message
            );
        }
    };

    // Borrar documento
    const deleteDocument = async (collectionName, idDoc) => {
        await deleteDoc(doc(db, collectionName, idDoc));
        try {
        } catch (error) {
            throw new Error("Error al eliminar usuario: " + error.message);
        }
    };

    // Listar problemas
    const fetchProblems = async () => {
        try {
            const problemsSnapshot = await getDocs(collection(db, "problemas"));
            if (!problemsSnapshot.empty) {
                const problemsData = problemsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                return problemsData;
            }
        } catch (error) {}
    };

    const fetchAssignedProblems = async (userId) => {
        try {
            // Buscar al usuario por ID
            const user = await fetchUser(userId);
            const userLevel = user.nivel;

            // Busca progreso de problemas del usuario
            const userProgressRef = doc(db, "progresoUsuario", userId);
            const userProgressSnapshot = await getDoc(userProgressRef);

            // Revisa si el usuario tiene problemas asignados
            if (
                !userProgressSnapshot.exists() ||
                !userProgressSnapshot.data().problemasAsignados
            ) {
                console.log("El usuario no tiene problemas asignados");
                return [];
            }

            const assignedProblems =
                userProgressSnapshot.data().problemasAsignados;

            // Filtra por status: asignado
            let filteredProblems = assignedProblems.filter(
                (problem) => problem.status === "asignado"
            );

            // Randomizar orden de problemas y limitar a 3
            filteredProblems.sort(() => Math.random() - 0.5);
            filteredProblems = filteredProblems.slice(0, 3);
            const problems = [];

            // Buscar detalles de problemas
            for (const problem of filteredProblems) {
                const problemId = problem.problemId;

                // Busca el documento del problema por ID
                const problemRef = doc(db, "problemas", problemId);
                const problemSnapshot = await getDoc(problemRef);

                if (problemSnapshot.exists()) {
                    const problemData = problemSnapshot.data();
                    // Revisa si el problema corresponde al mismo nivel del usuario
                    if (problemData.nivel == userLevel) {
                        problems.push({
                            id: problemSnapshot.id,
                            ...problemData,
                        });
                    }
                }
            }

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

    // Actualiza en firestore el array que contiene los problemas resueltos para cada usuario
    const updatePassedProblems = async (userId, problemId) => {
        try {
            const userProgressRef = doc(db, "progresoUsuario", userId);
            const userProgressSnapshot = await getDoc(userProgressRef);

            if (userProgressSnapshot.exists()) {
                const problemasAsignados =
                    userProgressSnapshot.data().problemasAsignados;

                // Busca el problema con su ID
                const problemIndex = problemasAsignados.findIndex(
                    (problem) => problem.problemId === problemId
                );

                if (problemIndex !== -1) {
                    // Marca el problema como completado y el timestamp de completado
                    problemasAsignados[problemIndex].status = "completado";
                    problemasAsignados[problemIndex].completionTimestamp =
                        new Date().toLocaleString();

                    // Actualiza el documento de progresoUsuario
                    await setDoc(
                        userProgressRef,
                        { problemasAsignados },
                        { merge: true }
                    );
                }
            } else {
                await setDoc(userProgressRef, {
                    problemasAsignados: [{ problemId, status: "completado" }],
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
            console.error("Error fetching user:", error);
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
                orderBy("timestamp", "desc"),
                limit(20)
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
        insertUser,
        insertProblem,
        fetchAssignedProblems,
        saveResults,
        updatePassedProblems,
        fetchUser,
        fetchUsers,
        fetchUserActivityLogs,
        fetchTotalProblemsCount,
        fetchTotalUsersCount,
        editDocument,
        deleteDocument,
        fetchProblems,
    };
};
