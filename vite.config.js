import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4004,
    host: true, // allow external access
    allowedHosts: ["trackwellness.in", "www.trackwellness.in"], // ✅ allow this domain
  },
});
