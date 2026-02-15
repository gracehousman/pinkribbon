/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use frontend as workspace root so Turbopack doesn't infer repo root when multiple lockfiles exist
  turbopack: {},
};

module.exports = nextConfig;
