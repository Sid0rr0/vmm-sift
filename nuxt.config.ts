import eslintPlugin from "vite-plugin-eslint"

export default defineNuxtConfig({
  app: {
    head: {
      bodyAttrs: {
        class: "m-0"
      }
    }
  },
  modules: ["@nuxtjs/tailwindcss"],
  vite: {
    plugins: [
      eslintPlugin()
    ]
  }
})
