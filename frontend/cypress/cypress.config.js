const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://flogin-frontend.onrender.com",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 120000,
  },
});