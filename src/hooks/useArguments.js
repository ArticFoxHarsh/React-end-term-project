/**
 * useArguments.js
 * 
 * Custom React hook for managing argument data in Firestore.
 * Provides real-time synchronization with the arguments collection.
 * 
 * Usage:
 *   const { arguments, loading, error, addArgument, deleteArgument } = useArguments();
 */

import { useEffect, useState, useContext, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import AuthContext from '../context/AuthContext';

/**
 * useArguments Hook
 * 
 * Manages all argument-related Firestore operations with real-time updates.
 * Automatically filters arguments by current user's UID.
 * 
 * Returns object with:
 * {
 *   arguments: Array<Object>,        // Array of all user's arguments (real-time updated)
 *   loading: boolean,                // True while initial arguments are being fetched
 *   error: string | null,            // Error message if fetch/operation fails
 *   addArgument: (data) => Promise,  // Function to create new argument
 *   deleteArgument: (id) => Promise  // Function to delete argument
 * }
 * 
 * Argument Data Structure:
 * {
 *   id: string,                      // Auto-generated Firestore doc ID
 *   uid: string,                     // User ID (filtered automatically)
 *   claim: string,                   // Main argument claim
 *   support: Array<string>,          // Supporting points/evidence
 *   topicTag: string,                // Topic category/tag
 *   usedInDebates: number,           // Count of debates where used
 *   createdAt: Timestamp             // Creation timestamp
 * }
 * 
 * Example:
 *   const { arguments: args, loading, addArgument, deleteArgument } = useArguments();
 *   
 *   if (loading) return <Spinner />;
 *   
 *   const handleAddArgument = async (claim, support, topicTag) => {
 *     try {
 *       await addArgument({ claim, support, topicTag });
 *       console.log('Argument added!');
 *     } catch (err) {
 *       console.error('Failed to add argument:', err);
 *     }
 *   };
 */
const useArguments = () => {
  const { user } = useContext(AuthContext);
  const [arguments, setArguments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Set up real-time listener for arguments
   * Runs when user changes (on login/logout)
   */
  useEffect(() => {
    if (!user) {
      setArguments([]);
      setLoading(false);
      return;
    }

    try {
      // Build query: arguments filtered by uid, ordered by creation date (newest first)
      const argumentsQuery = query(
        collection(db, 'arguments'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        argumentsQuery,
        (snapshot) => {
          try {
            // Transform Firestore docs to array with ID field
            const argumentsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setArguments(argumentsData);
            setLoading(false);
            setError(null);
          } catch (err) {
            console.error('Error processing arguments snapshot:', err);
            setError('Failed to load arguments');
            setLoading(false);
          }
        },
        (err) => {
          console.error('Firestore listener error:', err);
          setError('Failed to sync arguments');
          setLoading(false);
        }
      );

      // Cleanup: unsubscribe from listener when unmounted or user changes
      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up arguments listener:', err);
      setError('Failed to initialize arguments');
      setLoading(false);
    }
  }, [user]);

  /**
   * Add a new argument to Firestore
   * 
   * @param {Object} argumentData - Argument information to add
   * @param {string} argumentData.claim - Main argument claim
   * @param {Array<string>} argumentData.support - Supporting points/evidence
   * @param {string} argumentData.topicTag - Topic category
   * 
   * @returns {Promise<string>} ID of newly created argument
   * @throws {Error} If add operation fails
   */
  const addArgument = useCallback(
    async (argumentData) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        console.log('Adding argument for user:', user.uid);
        console.log('Argument data:', argumentData);
        
        const docRef = await addDoc(collection(db, 'arguments'), {
          uid: user.uid,
          ...argumentData,
          usedInDebates: 0,
          createdAt: serverTimestamp(),
        });
        
        console.log('Argument added successfully with ID:', docRef.id);
        return docRef.id;
      } catch (err) {
        console.error('Error adding argument:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        setError(`Failed to add argument: ${err.message}`);
        throw err;
      }
    },
    [user]
  );

  /**
   * Delete an argument from Firestore
   * 
   * @param {string} argumentId - ID of argument to delete
   * 
   * @returns {Promise<void>}
   * @throws {Error} If delete operation fails
   */
  const deleteArgument = useCallback(
    async (argumentId) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        await deleteDoc(doc(db, 'arguments', argumentId));
      } catch (err) {
        console.error('Error deleting argument:', err);
        setError('Failed to delete argument');
        throw err;
      }
    },
    [user]
  );

  return {
    arguments,
    loading,
    error,
    addArgument,
    deleteArgument,
  };
};

export default useArguments;
