# 3D Country Explorer 🌍

---

## 📝 Description

Welcome to the 3D Country Explorer!<br>

#### 💻 Technologies

- React
- React Three Fiber
- React Router DOM
- Redux Toolkit
- Drei
- GLSL
- GSAP
- Tailwind CSS
- Material UI
- React Hot Toast

---

## ✨ Features

- Explore countries in a unique way using a fully rotatable and clickable 3D Earth powered by React Three Fiber.
- Select a country either from the sidebar or directly by clicking on it on the 3D Earth — both instantly fetch and display country details.
- View key information about any country, including its capital, population, area, flag and more.
- Mark countries as liked with a simple like button. All liked countries are stored locally, so their data remains available offline.
- Easily revisit and view information about your liked countries from the dedicated "Liked" section — no internet needed.

---

## 🚀 Demo

[🔗 3D Country Explorer](https://3-d-country-explorer.vercel.app)

---

## 🛠 Installation

1. **Clone the repository**

```bash
git clone git@github.com:muzeffer-niftiyev/3D-Country-Explorer.git
```

2. **Install Dependencies**

   Run this command at terminat of the project:

```bash
    npm install
```

3. **Run the Project**

   Use the command below to run the project locally:

```bash
   npm run dev
```

The app uses the REST Countries v5 API. For production or higher request limits,
copy `.env.example` to `.env.local` for local development, then add an API key
with the app's hostname configured as an allowed browser origin:

```env
VITE_REST_COUNTRIES_API_KEY=your_api_key
```

For Vercel, open the project **Settings > Environment Variables**, add
`VITE_REST_COUNTRIES_API_KEY`, and set its value to your REST Countries API key
for the environments you use. Redeploy after changing it because Vite injects
`VITE_*` variables during the build.

This is a browser-side key, so it cannot be kept secret in this frontend. Restrict
it to the Vercel deployment hostname in the REST Countries API key settings.
