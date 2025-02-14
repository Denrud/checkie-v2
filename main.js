import { App } from "./core/App.js";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App();
  await app.initialize();
});
