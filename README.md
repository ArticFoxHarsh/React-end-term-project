# DebateVault

DebateVault is a React + Firebase app to track competitive speaking performance.
It helps you log debates, review outcomes, and measure growth over time.

## Deployment Link

- Live App: [https://react-end-term-project-azure.vercel.app/login]

## Core Features

- Firebase email/password authentication
- Protected app routes for logged-in users
- Debate logging with topic, format, side, outcome, date, and rating
- Notes + cool argument capture for each event
- Speech-to-text input for Notes and Cool Argument fields
- Dashboard stats: total debates, win rate, average rating
- Debates list with search and filters
- Insights page with charts using Recharts
- Mobile-friendly neon-brutalism themed UI

## Tech Stack

- React 18
- Vite 5
- React Router v6
- Firebase Auth + Firestore
- Tailwind CSS
- Recharts

## Routes

- /login
- /signup
- /dashboard
- /log
- /debates
- /debates/:id
- /insights
- /profile

## Quick Start

### 1) Prerequisites

- Node.js 18+
- npm
- Firebase project

### 2) Install

```bash
npm install
```

### 3) Create .env

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4) Run locally

```bash
npm run dev
```

Default local URL is usually http://localhost:5173

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Firebase References

- Setup guide: FIREBASE_SETUP_GUIDE.md
- Rules helper: FIRESTORE_RULES.js

## Build and Deploy

```bash
npm run build
```

Deploy dist/ to Vercel, Netlify, or Firebase Hosting.
Add the same VITE_FIREBASE_* env variables on your hosting platform.

## License

Academic/personal use unless you define a project license.

## Deployment Checklist

- Configure Firebase Auth in your project
- Configure Firestore database and rules
- Set all VITE_FIREBASE_* variables in hosting platform
- Set build command: npm run build
- Set output directory: dist
- Add deployed URL in Deployment Link section

## Troubleshooting

- If `npm run dev` fails, run `npm install` again and retry
- Verify your `.env` keys are correct and not wrapped in quotes
- Confirm Firebase project ID matches your web app config
- Use `npm run build` to validate production readiness

## Notes

- This project is configured with Vite + React (ES modules)
- Environment variables must start with `VITE_`
- Firebase config is read at runtime from `.env`
- Charts are rendered with Recharts on the Insights page

## Author

- Harsh Paliwal
- Project: DebateVault
- Semester end term React project
## Status

- Current version: 1.0.0
- Branch: main
- Build: passing (`npm run build`)
- Deployment URL: pending update
- Last README trim target: 100 lines
- Ready for deployment after environment setup
