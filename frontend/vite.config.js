import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [".flexdev.roche.com"],
  },
  preview: {
    allowedHosts: [".flexdev.roche.com"],
  },
});
