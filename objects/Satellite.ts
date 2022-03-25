import { randomColor } from "../lib/utils";
import * as THREE from "three";
export const satelliteObject = () => {
  const geometry = new THREE.SphereGeometry(0.01, 10, 10);
  // const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  // const material = new THREE.MeshPhongMaterial({
  //   color: 0xff00ff,
  //   wireframe: true,
  // });
  const material = new THREE.MeshLambertMaterial({
    // color: 0xff00ff,
    color: randomColor(),
    side: THREE.DoubleSide,
  });
  // material.onBeforeCompile = (shader) => {
  //   const token = "#include <begin_vertex>";
  //   const customTransform = `
  //         vec3 transformed = position + objectNormal*0.5;
  //     `;
  //   shader.vertexShader = shader.vertexShader.replace(token, customTransform);
  // };
  material.depthTest = false;
  return new THREE.Mesh(geometry, material);
};
