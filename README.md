# HealthIA

> A mobile-first AI wellness companion for nutrition, activity, and everyday health guidance — a React proof of concept.

<p align="center">
  <a href="https://healthia-ai.vercel.app"><img src="https://img.shields.io/badge/Live%20demo-Vercel-000000?style=for-the-badge&logo=vercel" alt="Live demo" /></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React 19" />
  <img src="https://img.shields.io/badge/Frontend%20only-POC-0957DE?style=for-the-badge" alt="Frontend-only POC" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6a6dfcd8-726a-41e1-bc6d-92ec5ad27f16" alt="HealthIA product preview" />
</p>

HealthIA explores how a wellness app could combine wearable data and AI guidance to give personalized advice on meals, workouts, and habits. It is a **frontend-only proof of concept**: everything runs in the browser, so the live demo works without any server, API key, or account setup.

> **Prototype notice:** HealthIA is an educational prototype, not a medical device or a substitute for professional medical advice.

## Try it

**[healthia-ai.vercel.app](https://healthia-ai.vercel.app)** — open it on your phone or in a mobile-sized browser window.

## The problem

- 🩺 **Chronic disease epidemic** — obesity, diabetes, and hypertension driven by poor daily routines.
- 🚪 **Low engagement with health apps** — most users quit within 30 days due to lack of relevance and feedback.
- 📊 **Fragmented health data** — wearables and food logs are siloed and rarely used for real-time personalized feedback.

## What the demo shows

- 💬 **Health chatbot** — ask about food, exercise, sleep, hydration, or stress and get practical suggestions (text, image, and voice-note input).
- 📸 **Meal scanner** — snap or upload a plate and compare it with the Harvard Healthy Eating Plate, with tips such as "add more greens".
- 🥗 **Meal plans** — daily meal suggestions built around Peruvian dishes.
- 🏋️ **Workout planner** — guided activities and routines.
- 🩺 **Health profile** — conditions, allergies, and emergency contacts.
- ⌚ **Wearable dashboard** — smartwatch-style metrics for steps, heart rate, and sleep.

## Screens

<p align="center">
  <img src="https://github.com/user-attachments/assets/8493337e-9a81-43b8-ac3d-600db5138898" alt="HealthIA meal analysis flow" width="31%" />
  <img src="https://github.com/user-attachments/assets/94fe574f-51e9-4ef6-b57b-98f08a751b96" alt="HealthIA personalized meal plan" width="31%" />
  <img src="https://github.com/user-attachments/assets/712efe78-cff1-40c6-aa16-f526736e4739" alt="HealthIA workout planner" width="31%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/a759a9d0-d627-4262-a1e7-2e68e98e117f" alt="HealthIA medical personalization" width="48%" />
</p>

## How it works

The chatbot and the meal scanner are answered by [`src/localApi.js`](./src/localApi.js), a small in-browser module that simulates the assistant: chat answers come from health-topic rules, plate analysis returns sample results scored against the Harvard plate, and conversations and analyses are saved in the browser's `localStorage`. No data leaves the device.

| Area | Tech |
| --- | --- |
| UI | React 19, React Router 7, Create React App |
| Demo logic | `src/localApi.js` (simulated chat and plate analysis, `localStorage` history) |
| Hosting | Vercel |
| CI | GitHub Actions — tests and production build on every push and pull request |

## Run locally

```bash
npm ci
npm start        # http://localhost:3000
npm test         # unit tests for the demo logic
npm run build    # production build in build/
```

Demo account for the login screen: `fransua@healthia.com` / `cevicheria`.

## Team

<p align="center">
  <a href="https://www.linkedin.com/in/fransua-leon/"><img src="https://img.shields.io/badge/Fransua%20Leon-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Fransua Leon on LinkedIn" /></a>
  <a href="https://www.linkedin.com/in/sergioyupanquigomez/"><img src="https://img.shields.io/badge/Sergio%20Yupanqui-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Sergio Yupanqui on LinkedIn" /></a>
  <a href="https://www.linkedin.com/in/luisangelorp/"><img src="https://img.shields.io/badge/Luis%20Rodriguez-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Luis Rodriguez on LinkedIn" /></a>
</p>

## License

No license file is currently included. Add a license before accepting external contributions or redistributing the code.
