import App from "./App";
const initApp = (): void => {
  new App();
};
window.addEventListener("DOMContentLoaded", initApp);
// @ts-ignore
module.hot &&
  // @ts-ignore
  module.hot.accept(() => {
    // initApp();
    // More brutal
    window.location.reload();
  });
