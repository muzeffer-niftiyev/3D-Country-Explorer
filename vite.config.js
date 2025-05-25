import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [react(), tailwindcss(), glsl()],
  server: {
    open: true,
    host: true,
  },
});
