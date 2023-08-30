import { collection, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getCollectionData = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};


export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef;
  } catch (error) {
    throw new Error("Error adding document: " + error.message);
  }
};

export const updateDocument = async (collectionName, docId, updatedData) => {
  const docRef = doc(db, collectionName, docId);
  try {
    await updateDoc(docRef, updatedData);
  } catch (error) {
    throw new Error("Error updating document: " + error.message);
  }
};

export const deleteDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error("Error deleting document: " + error.message);
  }
};