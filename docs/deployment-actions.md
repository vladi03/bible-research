# Deployment Actions

## Overview
This project deploys Firebase Hosting, Firestore rules, and Cloud Functions from GitHub Actions. The workflows build the React app in `web/`, then call `firebase deploy` for the targeted environment.

## Secrets
Configure these repository secrets (already created):
- `FIREBASE_TOKEN`: Firebase CI token generated with `firebase login:ci` for the account that can deploy to both projects.
- `GCLOUD_PROJECT_PROD`: `bible-resaerch`.
- `GCLOUD_PROJECT_DEV`: `bible-resaerch-dev`.

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