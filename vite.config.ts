export default defineConfig(({ mode }) => ({
  base: "/pfizer-insight-portal/", // 👈 Correct for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
