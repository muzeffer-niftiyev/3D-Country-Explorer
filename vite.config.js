import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import glsl from "vite-plugin-glsl";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), glsl()],
    server: {
      open: true,
      host: true,
      proxy: {
        "/api/countries": {
          target: "https://api.restcountries.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/countries/, "/countries/v5"),
          headers: {
            Authorization: `Bearer ${env.REST_COUNTRIES_API_KEY || ""}`,
          },
        },
      },
    },
  };
});
