/**
 * FIRESTORE SECURITY RULES
 * 
 * Copy ALL of this code into your Firebase Console:
 * 1. Go to: https://console.firebase.google.com/project/react-end-term-project-58e50/firestore/rules
 * 2. Select "Edit Rules"
 * 3. Delete everything and paste this entire code
 * 4. Click "Publish"
 * 
 * These rules ensure:
 * - Users can only read/write their own data
 * - Users can only create debates/arguments with their own uid
 * - No unauthorized access to other users' data
 */

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // USERS COLLECTION
    // ============================================
    // Users can only read/write their own user document
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // ============================================
    // DEBATES COLLECTION
    // ============================================
    // Allow users to create debates (with proper uid)
    match /debates/{debateId} {
      allow create: if request.auth != null 
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.topic != null
        && request.resource.data.format != null
        && request.resource.data.outcome != null
        && request.resource.data.date != null;
      
      // Allow users to read/write only their own debates
      allow read, update, delete: if request.auth != null 
        && resource.data.uid == request.auth.uid;
    }

    // ============================================
    // ARGUMENTS COLLECTION
    // ============================================
    // Allow users to create arguments (with proper uid)
    match /arguments/{argId} {
      allow create: if request.auth != null 
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.claim != null
        && request.resource.data.support != null
        && request.resource.data.topicTag != null;
      
      // Allow users to read/write only their own arguments
      allow read, update, delete: if request.auth != null 
        && resource.data.uid == request.auth.uid;
    }

  }
}
