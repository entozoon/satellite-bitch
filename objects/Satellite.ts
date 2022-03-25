import * as THREE from "three";
export const createSatelliteObject = (satellite) => {
  const satGeometry = new THREE.SphereGeometry(0.01, 10, 10);
  // const satMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  // const satMaterial = new THREE.MeshPhongMaterial({
  //   color: 0xff00ff,
  //   wireframe: true,
  // });
  const satMaterial = new THREE.MeshLambertMaterial({
    color: 0xff00ff,
    side: THREE.BackSide,
  });
  satMaterial.onBeforeCompile = (shader) => {
    const token = "#include <begin_vertex>";
    const customTransform = `
        vec3 transformed = position + objectNormal*0.05;
    `;
    shader.vertexShader = shader.vertexShader.replace(token, customTransform);
  };
  const object = new THREE.Mesh(satGeometry, satMaterial);
  return object;
};
