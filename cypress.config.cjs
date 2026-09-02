const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:4300',
    specPattern: 'e2e/**/*.cy.ts',
    supportFile: false,
    video: false
  }
});
