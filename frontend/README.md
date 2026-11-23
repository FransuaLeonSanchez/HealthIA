# HealthIA frontend

React 19 frontend for HealthIA, with a mobile-first experience for nutrition, activity, conversational guidance, and health-profile flows.

**Live UI:** [healthia-ai.vercel.app](https://healthia-ai.vercel.app) · **API:** [backend README](../backend/README.md)

## Quick start

```bash
npm ci
copy .env.example .env.local  # PowerShell; use cp on macOS/Linux
npm start
```

Open [http://localhost:3000](http://localhost:3000). In development the API URL defaults to `http://localhost:8000`; set `REACT_APP_API_URL` to the Spring Boot API base (for example `http://localhost:8080/api/v1`).

## Production build

```bash
npm run build
```

The project is configured for Vercel as a Create React App. Set the Vercel **Root Directory** to `frontend`. Chat and image-analysis actions require a backend URL in `REACT_APP_API_URL`; without it the production build calls relative paths on the same origin.

## Feature areas

- Login and onboarding flow
- Nutrition and meal-plan screens
- Meal image analysis client
- Conversational assistant client
- Activity and wearable-device views
- Health profile and emergency-contact views

Credentials belong only in the backend environment, never in this frontend bundle.
