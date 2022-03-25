import { randomColor } from "../lib/utils";
import * as THREE from "three";
import { Mesh } from "three";
export const satelliteObject = () => {
  const geometry = new THREE.SphereGeometry(0.003, 5, 5);
  // const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
  const material = new THREE.MeshBasicMaterial({
    color: randomColor(),
    // Rendering very strangely when you get close.. no idea why, but I feel like it's not shadows
    clipShadows: false,
    clippingPlanes: [],
    side: THREE.DoubleSide,
    depthTest: false,
  });
  // const material = new THREE.MeshPhongMaterial({
  //   color: 0xff00ff,
  //   wireframe: true,
  // });
  // const material = new THREE.MeshLambertMaterial({
  //   // color: 0xff00ff,
  //   color: randomColor(),
  //   // side: THREE.DoubleSide,
  //   // wireframe: true,
  // });
  // material.onBeforeCompile = (shader) => {
  //   const token = "#include <begin_vertex>";
  //   const customTransform = `
  //         vec3 transformed = position + objectNormal*0.02;
  //     `;
  //   shader.vertexShader = shader.vertexShader.replace(token, customTransform);
  // };
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
};
