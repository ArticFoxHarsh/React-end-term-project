/**
 * useDebates.js
 * 
 * Custom React hook for managing debate data in Firestore.
 * Provides real-time synchronization with the debates collection.
 * 
 * Usage:
 *   const { debates, loading, error, addDebate, updateDebate, deleteDebate } = useDebates();
 */

import { useEffect, useState, useContext, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import AuthContext from '../context/AuthContext';

/**
 * useDebates Hook
 * 
 * Manages all debate-related Firestore operations with real-time updates.
 * Automatically filters debates by current user's UID.
 * 
 * Returns object with:
 * {
 *   debates: Array<Object>,           // Array of all user's debates (real-time updated)
 *   loading: boolean,                 // True while initial debates are being fetched
 *   error: string | null,             // Error message if fetch/operation fails
 *   addDebate: (data) => Promise,     // Function to create new debate
 *   updateDebate: (id, data) => Promise,  // Function to update existing debate
 *   deleteDebate: (id) => Promise     // Function to delete debate
 * }
 * 
 * Debate Data Structure:
 * {
 *   id: string,                       // Auto-generated Firestore doc ID
 *   uid: string,                      // User ID (filtered automatically)
 *   topic: string,                    // Debate topic
 *   format: string,                   // "TurnCoat" | "MUN" | "GD" | "Parliamentary"
 *   side: string,                     // "For" | "Against" | "Neutral"
 *   outcome: string,                  // "Win" | "Loss" | "Draw"
 *   rating: number,                   // 1-5 rating
 *   notes: string,                    // Optional notes
 *   date: Timestamp                   // Date of debate
 * }
 * 
 * Example:
 *   const { debates, loading, addDebate, deleteDebate } = useDebates();
 *   
 *   if (loading) return <Spinner />;
 *   
 *   const handleAddDebate = async (formData) => {
 *     try {
 *       await addDebate(formData);
 *       console.log('Debate added!');
 *     } catch (err) {
 *       console.error('Failed to add debate:', err);
 *     }
 *   };
 */
const useDebates = () => {
  const { user } = useContext(AuthContext);
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Set up real-time listener for debates
   * Runs when user changes (on login/logout)
   */
  useEffect(() => {
    if (!user) {
      setDebates([]);
      setLoading(false);
      return;
    }

    try {
      // Build query: debates filtered by uid, ordered by date (newest first)
      const debatesQuery = query(
        collection(db, 'debates'),
        where('uid', '==', user.uid),
        orderBy('date', 'desc')
      );

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        debatesQuery,
        (snapshot) => {
          try {
            // Transform Firestore docs to array with ID field
            const debatesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDebates(debatesData);
            setLoading(false);
            setError(null);
          } catch (err) {
            console.error('Error processing debates snapshot:', err);
            setError('Failed to load debates');
            setLoading(false);
          }
        },
        (err) => {
          console.error('Firestore listener error:', err);
          setError('Failed to sync debates');
          setLoading(false);
        }
      );

      // Cleanup: unsubscribe from listener when unmounted or user changes
      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up debates listener:', err);
      setError('Failed to initialize debates');
      setLoading(false);
    }
  }, [user]);

  /**
   * Add a new debate to Firestore
   * 
   * @param {Object} debateData - Debate information to add
   * @param {string} debateData.topic - Debate topic
   * @param {string} debateData.format - Debate format
   * @param {string} debateData.side - Which side debater took
   * @param {string} debateData.outcome - Result of debate
   * @param {number} debateData.rating - Rating 1-5
   * @param {string} debateData.notes - Optional notes
   * @param {Date} debateData.date - Date of debate
   * 
   * @returns {Promise<string>} ID of newly created debate
   * @throws {Error} If add operation fails
   */
  const addDebate = useCallback(
    async (debateData) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        console.log('Adding debate for user:', user.uid);
        console.log('Debate data:', debateData);
        
        const docRef = await addDoc(collection(db, 'debates'), {
          uid: user.uid,
          ...debateData,
          date: debateData.date instanceof Date 
            ? debateData.date 
            : new Date(debateData.date),
          createdAt: serverTimestamp(),
        });
        
        console.log('Debate added successfully with ID:', docRef.id);
        return docRef.id;
      } catch (err) {
        console.error('Error adding debate:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        setError(`Failed to add debate: ${err.message}`);
        throw err;
      }
    },
    [user]
  );

  /**
   * Update an existing debate in Firestore
   * 
   * @param {string} debateId - ID of debate to update
   * @param {Object} updateData - Fields to update
   * 
   * @returns {Promise<void>}
   * @throws {Error} If update operation fails
   */
  const updateDebate = useCallback(async (debateId, updateData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const debateRef = doc(db, 'debates', debateId);
      
      // Prepare update data
      const dataToUpdate = { ...updateData };
      
      // Convert date if provided
      if (updateData.date && !(updateData.date instanceof Date)) {
        dataToUpdate.date = new Date(updateData.date);
      }

      await updateDoc(debateRef, dataToUpdate);
    } catch (err) {
      console.error('Error updating debate:', err);
      setError('Failed to update debate');
      throw err;
    }
  }, [user]);

  /**
   * Delete a debate from Firestore
   * 
   * @param {string} debateId - ID of debate to delete
   * 
   * @returns {Promise<void>}
   * @throws {Error} If delete operation fails
   */
  const deleteDebate = useCallback(
    async (debateId) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        await deleteDoc(doc(db, 'debates', debateId));
      } catch (err) {
        console.error('Error deleting debate:', err);
        setError('Failed to delete debate');
        throw err;
      }
    },
    [user]
  );

  return {
    debates,
    loading,
    error,
    addDebate,
    updateDebate,
    deleteDebate,
  };
};

export default useDebates;
