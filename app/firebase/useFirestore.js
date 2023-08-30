import { useEffect, useState } from "react";
import { getCollectionData, addDocument } from "./FirestoreService";

export const useFirestore = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCollectionData = async (collectionName) => {
    setIsLoading(true);
    try {
      const collectionData = await getCollectionData(collectionName);
      setData(collectionData);
    } catch (error) {
      console.error("Error fetching collection data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const insertDocument = async (collectionName, data) => {
    try {
      await addDocument(collectionName, data);
      // Optionally, you can refetch the data after insertion
      fetchCollectionData(collectionName);
    } catch (error) {
      console.error("Error inserting document:", error);
    }
  };

  const updateDocumentData = async (collectionName, docId, updatedData) => {
    try {
      await updateDocument(collectionName, docId, updatedData);
      // Optionally, you can refetch the data after updating
      fetchCollectionData(collectionName);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const removeDocument = async (collectionName, docId) => {
    try {
      await deleteDocument(collectionName, docId);
      // Optionally, you can refetch the data after deletion
      fetchCollectionData(collectionName);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  useEffect(() => {
    // Fetch initial data when the hook is mounted
    fetchCollectionData("yourCollectionName");
  }, []);

  return {
    data,
    isLoading,
    fetchCollectionData,
    insertDocument,
    updateDocumentData,
    removeDocument,
  };
};
