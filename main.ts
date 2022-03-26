import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import App from "./App";
const loadDir =
  window.location.hostname === "localhost" ? "http://localhost:8000/" : "/";
const fontLoader = new FontLoader();
const initApp = (): void => {
  fontLoader.load(`${loadDir}/helvetiker_regular.typeface.json`, (font) => {
    new App({ font });
  });
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
