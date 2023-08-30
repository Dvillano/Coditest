import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    query,
    where,
    collection,
    setDoc,
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

    return {
        isLoading,
        insertDocument,
        insertUser,
        updateDocumentData,
        removeDocument,
    };
};
