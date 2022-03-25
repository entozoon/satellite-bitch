import * as THREE from "three";
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
if (
  /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
    navigator.userAgent
  )
) {
  alert("Warning: It drinks battery juice!");
}
