# 🔒 DebateVault - Firebase Setup Guide

## Step 1: Deploy Firestore Security Rules

**Go to Firebase Console:**
```
https://console.firebase.google.com/project/react-end-term-project-58e50/firestore/rules
```

**Copy the rules from FIRESTORE_RULES.js file in project root**

**In Firebase Console:**
1. Click "Edit Rules" button
2. Delete all existing rules
3. Paste the complete ruleset from FIRESTORE_RULES.js
4. Click "Publish" ✅

---

## Step 2: Create Firestore Composite Indexes

Go to: https://console.firebase.google.com/u/0/project/react-end-term-project-58e50/firestore/indexes

### Index 1: Debates (for Dashboard & Debates page)
- **Collection:** `debates`
- **Fields:**
  - `uid` (Ascending) ✓
  - `date` (Descending) ✓
- Click **"Create Index"**
- Wait 1-2 minutes to build

### Index 2: Arguments (for Arguments page)
- **Collection:** `arguments`
- **Fields:**
  - `uid` (Ascending) ✓
  - `createdAt` (Descending) ✓
- Click **"Create Index"**
- Wait 1-2 minutes to build

---

## Step 3: Verify in Firestore Console

Go to: https://console.firebase.google.com/project/react-end-term-project-58e50/firestore/data

1. Click on **"debates"** collection
2. You should see your debate documents with:
   - Document ID (auto-generated)
   - Fields: `uid`, `topic`, `format`, `side`, `outcome`, `rating`, `notes`, `date`, `createdAt`

3. Click on **"arguments"** collection
4. You should see argument documents with:
   - Fields: `uid`, `claim`, `support[]`, `topicTag`, `usedInDebates`, `createdAt`

---

## What These Rules Do

### ✅ Allowed Operations

**CREATE:**
- ✓ User can create a debate if `uid` = their user ID
- ✓ User can create an argument if `uid` = their user ID

**READ:**
- ✓ User can read only debates where `uid` = their user ID
- ✓ User can read only arguments where `uid` = their user ID

**UPDATE/EDIT:**
- ✓ User can edit debates they own
- ✓ User can edit arguments they own

**DELETE:**
- ✓ User can delete debates they own
- ✓ User can delete arguments they own

### ❌ Blocked Operations

- ✗ User cannot read other users' debates
- ✗ User cannot read other users' arguments
- ✗ User cannot create data with someone else's uid
- ✗ User cannot modify other users' data
- ✗ Unauthenticated users cannot access any data

---

## Testing the Setup

1. **Sign up** with email: test@example.com
2. **Log a debate:**
   - Topic: "Climate Change"
   - Format: "MUN"
   - Outcome: "Win"
   - Click **"Speak"** to add notes via voice
3. **Go to Dashboard** - you should see it in "Recent Debates"
4. **Go to Debates page** - you should see all your debates
5. **Go to Arguments page** - create an argument

If you see any errors:
- Check browser console (F12) for error messages
- Ensure indexes are fully built (status should be "Enabled", not "Building")
- Verify rules are published (check Rules tab in Firebase Console)

---

## Troubleshooting

**Error: "Missing or insufficient permissions"**
- Solution: Check that rules are published in Firebase Console

**Error: "The query requires an index"**
- Solution: Make sure both composite indexes are fully built

**Debates not showing on Dashboard**
- Solution: 
  1. Check Firestore Console - see if debate doc exists
  2. Check browser console (F12) for errors
  3. Verify `uid` field matches your user ID
  4. Wait 30 seconds for real-time sync

**Speech-to-text not working**
- Use Chrome, Edge, or Safari browser
- Allow microphone permission when browser asks
- Check browser console for errors

---

## Data Structure Reference

### debates collection
```javascript
{
  uid: "user123",           // Auto-set by security rules
  topic: "Climate Change",
  format: "MUN",
  side: "For",
  outcome: "Win",
  rating: 4,
  notes: "Great opening, need to improve rebuttal",
  date: Timestamp(2024-04-20),
  createdAt: Timestamp(2024-04-20 14:30:00)
}
```

### arguments collection
```javascript
{
  uid: "user123",           // Auto-set by security rules
  claim: "Climate change is human-caused",
  support: [
    "CO2 levels rising since industrial revolution",
    "97% of scientists agree"
  ],
  topicTag: "Environment",
  usedInDebates: 2,
  createdAt: Timestamp(2024-04-20)
}
```

### users collection
```javascript
{
  email: "test@example.com",
  displayName: "John Doe",
  goals: "Win 10 debates this season",
  createdAt: Timestamp(2024-04-20)
}
```

---

**✅ You're all set! Your DebateVault app is now production-ready with secure database rules!**
