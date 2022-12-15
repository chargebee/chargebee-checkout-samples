import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  base: "/components-examples/vue/",
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // dedupe: ["vue"]
  },
  server: {
    fs: {
      allow: ["/Users/cbit011058/Projects/Chargebee/"],
    }
  },
});
