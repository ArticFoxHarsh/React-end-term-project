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
 * - Users can only create debates with their own uid
 * - No unauthorized access to other users' data
 */

const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    match /debates/{debateId} {
      allow create: if request.auth != null
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.topic != null
        && request.resource.data.format != null
        && request.resource.data.outcome != null
        && request.resource.data.date != null;

      allow read, update, delete: if request.auth != null
        && resource.data.uid == request.auth.uid;
    }

  }
}`;

export default firestoreRules;
