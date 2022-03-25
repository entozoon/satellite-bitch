import * as THREE from "three";
import { AnaglyphEffect } from "three/examples/jsm/effects/AnaglyphEffect.js";
import { anaglyphMode } from "../App";
const Renderer = () => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    // precision: "lowp", // optimisation
    failIfMajorPerformanceCaveat: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.BasicShadowMap;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // Brutal body replace, to cancel event listeners and the like
  document.body.replaceWith(document.body.cloneNode(true));
  const wrapper = document.querySelector(".app-wrapper") as HTMLElement;
  wrapper.querySelector("canvas")?.remove();
  wrapper.appendChild(renderer.domElement);
  return anaglyphMode ? new AnaglyphEffect(renderer) : renderer;
};
export let renderer;
export let scene;
export const reset = () => {
  renderer = Renderer();
  scene = new THREE.Scene();
};
export const clock = new THREE.Clock();
