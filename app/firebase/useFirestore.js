//useFirestore.js
// Este módulo proporciona funciones para interactuar con Firestore.
// Se encarga de insertar usuarios y problemas, editar y eliminar documentos, y recuperar datos relacionados con usuarios y problemas.

import {
    doc,
    addDoc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    arrayUnion,
    query,
    collection,
    getDocs,
    orderBy,
    limit,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const useFirestore = () => {
    // Insertar usuario y su progreso inicial.
    const insertUser = async (user, userData) => {
        const userRef = doc(collection(db, "usuarios"), user.uid);
        const userProgressRef = doc(
            collection(db, "progresoUsuario"),
            user.uid
        );

        const initialUserProgress = {
            problemasAsignados: [],
        };

        try {
            await setDoc(userRef, userData, { merge: true });
            await setDoc(userProgressRef, initialUserProgress, { merge: true });
        } catch (error) {
            throw new Error(
                "Error guardando informacion del usuario: " + error.message
            );
        }
    };

    // Insertar problema
    const insertProblem = async (problemData) => {
        const problemasCollectionRef = collection(db, "problemas");

        try {
            const problemasRef = await addDoc(
                problemasCollectionRef,
                problemData
            );
            const uid = problemasRef.id;
            problemData.id = uid;
            await setDoc(problemasRef, problemData, { merge: true });

            return { ...problemData, uid };
        } catch (error) {
            throw new Error("Error al insertar problema: " + error.message);
        }
    };

    // Editar documento
    const editDocument = async (collectionName, idDoc, data) => {
        const docRef = doc(db, collectionName, idDoc);
        try {
            await updateDoc(docRef, data, { merge: true });
        } catch (error) {
            throw new Error("Error al editar documento: " + error.message);
        }
    };

    // Actualizar problema
    const updateAssignedProblem = async (collectionName, idDoc, data) => {
        const docRef = doc(db, collectionName, idDoc);
        data.forEach(async (element) => {
            try {
                await updateDoc(
                    docRef,
                    { problemasAsignados: arrayUnion(element) },
                    { merge: true }
                );
            } catch (error) {
                throw new Error(
                    "Error al modificar el documento: " + error.message
                );
            }
        });
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

    // Listar todos los problemas
    const fetchAllUsersProgress = async () => {
        try {
            const userProgressSnapshot = await getDocs(
                collection(db, "progresoUsuario")
            );
            if (!userProgressSnapshot.empty) {
                const userProgressData = userProgressSnapshot.docs.map(
                    (doc) => ({
                        ...doc.data(),
                    })
                );
                return userProgressData;
            }
        } catch (error) {}
    };

    // Listar problemas asignados
    const fetchCompletedProblems = async (userId) => {
        try {
            const userProgressRef = doc(db, "progresoUsuario", userId);
            const userProgressSnapshot = await getDoc(userProgressRef);

            // Revisa si el usuario tiene problemas asignados
            if (
                !userProgressSnapshot.exists() ||
                !userProgressSnapshot.data().problemasAsignados
            ) {
                return [];
            }

            const assignedProblems =
                userProgressSnapshot.data().problemasAsignados;

            // Filtra por status: completado
            let completedProblems = assignedProblems.filter(
                (problem) => problem.status === "completado"
            );

            let problemsList = await fetchProblems();

            completedProblems = completedProblems.map((completedProblem) => {
                const problem = problemsList.find(
                    (problem) => problem.id == completedProblem.problemId
                );
                return {
                    ...problem,
                    titulo: problem ? problem.titulo : null,
                };
            });

            return completedProblems;
        } catch (error) {
            console.error("Error buscando problemas completados:", error);
            return [];
        }
    };

    // Buscar problemas asignados
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
            console.error("Error buscando problemas asignados:", error);
            return [];
        }
    };

    // Buscar problemas sin asignar
    const fetchUnassignedProblems = async (userId) => {
        try {
            // Buscar al usuario por ID
            const user = await fetchUser(userId);
            const userLevel = user.nivel;

            // Busca progreso de problemas del usuario
            const userProgressRef = doc(db, "progresoUsuario", userId);
            const userProgressSnapshot = await getDoc(userProgressRef);

            // Lista de problemas asignados al usuarios (Esten o no completos)
            const assignedProblems =
                userProgressSnapshot.data()?.problemasAsignados;

            // Lista de todos los problemas
            const problemsList = await fetchProblems();

            // Filtrar los problemas no asignados y del mismo nivel
            const unassignedProblems = problemsList.filter((problem) => {
                return (
                    !assignedProblems.some(
                        (assignedProblem) =>
                            assignedProblem.problemId === problem.id
                    ) && problem.nivel === userLevel
                );
            });

            return unassignedProblems;
        } catch (error) {
            console.error("Error buscando problemas no asignados:", error);
            return [];
        }
    };

    // Guardar resultados del problema
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
            console.error("Error guardando resultados:", error);
        }
    };

    // Buscar progreso del usuario
    const fetchUserProgress = async (userId) => {
        try {
            const userProgressRef = doc(db, "progresoUsuario", userId);
            const userProgressSnapshot = await getDoc(userProgressRef);
            return userProgressSnapshot.exists()
                ? userProgressSnapshot.data().problemasAsignados
                : [];
        } catch (error) {
            console.error("Error buscando el progreso dle usuario:", error);
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
            console.error("Error actualizando el progreso del usuario:", error);
        }
    };

    // Buscar un usuario
    const fetchUser = async (userId) => {
        try {
            const userRef = doc(db, "usuarios", userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                return userData;
            }
        } catch (error) {
            console.error("Error buscando usuario:", error);
        }
    };

    // Buscar todos los usuarios
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
            console.error("Error buscando usuarios:", error);
        }
    };

    // Buscar la actividad de los logs
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
            console.error(
                "Error buscando los logs de actividad del usuario:",
                error
            );
            return [];
        }
    };

    // Buscar la cantidad total de problemas
    const fetchTotalProblemsCount = async () => {
        try {
            const problemsQuery = collection(db, "problemas");
            const problemsSnapshot = await getDocs(problemsQuery);

            return problemsSnapshot.size;
        } catch (error) {
            console.error(
                "Error buscando la cantidad total de problemas:",
                error
            );
            return 0;
        }
    };

    // Buscar el numero total de usuarios
    const fetchTotalUsersCount = async () => {
        try {
            const usersQuery = collection(db, "usuarios");
            const usersSnapshot = await getDocs(usersQuery);
            return usersSnapshot.size;
        } catch (error) {
            console.error("Error buscando el numero total de usuarios:", error);
            return 0;
        }
    };

    // Funcion para buscar todos los resultados de los tests
    const fetchAllResults = async () => {
        try {
            const resultsCollection = collection(db, "resultados");
            const resultsSnapshot = await getDocs(resultsCollection);

            if (!resultsSnapshot.empty) {
                const resultsData = resultsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                return resultsData;
            }
        } catch (error) {
            console.error("Error buscando resultados:", error);
            return [];
        }
    };

    return {
        insertUser,
        insertProblem,
        fetchAssignedProblems,
        fetchCompletedProblems,
        fetchUnassignedProblems,
        saveResults,
        updatePassedProblems,
        fetchUser,
        fetchUserProgress,
        fetchAllUsersProgress,
        fetchUsers,
        fetchUserActivityLogs,
        fetchTotalProblemsCount,
        fetchTotalUsersCount,
        editDocument,
        updateAssignedProblem,
        deleteDocument,
        fetchProblems,
        fetchAllResults,
    };
};
