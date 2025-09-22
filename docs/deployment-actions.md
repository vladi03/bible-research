# Deployment Actions

## Overview
This project deploys Firebase Hosting, Firestore rules, and Cloud Functions from GitHub Actions. The workflows build the React app in `web/`, then call `firebase deploy` for the targeted environment.

## Secrets
Configure these repository secrets:
- `FIREBASE_TOKEN`: Firebase CI token generated with `firebase login:ci` for the account that can deploy to both projects.
- `GCLOUD_PROJECT_PROD`: `bible-resaerch`.
- `GCLOUD_PROJECT_DEV`: `bible-resaerch-dev`.
- `FIREBASE_WEB_CONFIG_PROD`: multi-line `.env` block that holds the Firebase web SDK values for the production project (see "Firebase Authentication Setup").
- `FIREBASE_WEB_CONFIG_DEV`: same as above for the development project.

## Firebase Authentication Setup
1. Create dedicated Firebase Web Apps for each environment using the CLI:
   ```bash
   firebase apps:create WEB "Bible Research Web" --project bible-resaerch
   firebase apps:create WEB "Bible Research Web Dev" --project bible-resaerch-dev
   ```
   Then capture the SDK configuration for each app (the `appId` values come from the `apps:create` responses):
   ```bash
   firebase apps:sdkconfig WEB 1:11675054775:web:ba7d79ae29a0bd2bf31332 --project bible-resaerch --json
   firebase apps:sdkconfig WEB 1:109191613279:web:53c6d8eeb36edf1148c4ea --project bible-resaerch-dev --json
   ```
2. In the Firebase console, go to **Build -> Authentication -> Sign-in method** for each project. Enable **Email/Password** (and any additional providers the app should support, such as Google) and confirm that `localhost`, `bible-resaerch.firebaseapp.com`, and `bible-resaerch-dev.firebaseapp.com` are listed under **Authorized domains**.
3. Copy the following fields from each SDK config into your environment:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

   Store the production/dev pairs in the GitHub secrets above for CI/CD and create matching `.env` files (ignored by git) when running the Vite app locally.

## Required CLI Configuration
- Keep `firebase.json` at the repo root so both Hosting and Functions share the same config.
- Ensure `functions/package.json` and `web/package.json` scripts reference `--config ../firebase.json` when run from their directories.

## Workflow Outline
Each workflow does the following:
1. Check out the repository.
2. Set up Node (v20) with npm cache keyed to `web/` and `functions/` lockfiles.
3. Install dependencies in `web/` and `functions/` using `npm ci`.
4. Build the web app (`npm run build` in `web/`).
5. Deploy to Firebase using the appropriate project ID and token.

## GitHub Workflows
Two workflows exist under `.github/workflows`:

- **`deploy-prod.yml`**
  - Trigger: `push` to `main` (PR merged to main).
  - Deploys Hosting, Firestore rules, and Functions to `bible-resaerch`.

- **`deploy-dev.yml`**
  - Trigger: `push` to any branch except `main` (covers feature and develop branches).
  - Deploys Hosting, Firestore rules, and Functions to `bible-resaerch-dev`.

Both workflows share the same structure and use the secrets defined above. Adjust the triggers or `--only` flags if the deployment policy changes.

