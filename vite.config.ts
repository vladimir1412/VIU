import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    vue({
      template: {
        // Currently, there's no support for v-model on custom elements in Vue. You can handle two-way binding manually, but's it rather verbose.
        // This utility solves this problem by creating a custom directive that works just like v-model but for Shoelace components.
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("sl-"),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
