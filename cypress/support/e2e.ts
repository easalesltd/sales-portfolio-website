// Cypress E2E support file.
// Ignore known React hydration warning in headless Electron during smoke runs.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Minified React error #418')) {
    return false
  }
  return true
})
