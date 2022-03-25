import { randomColor } from "../lib/utils";
import * as THREE from "three";
import { Mesh } from "three";
// const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
// const geometry = new THREE.SphereGeometry(0.003, 6, 6);
// const geometry = new THREE.BoxBufferGeometry(0.3, 0.3, 0.3);
const textureLoader = new THREE.TextureLoader();
export const satelliteObject = (satellite, highlight = false) => {
  // const material = new THREE.MeshBasicMaterial({
  //   color: randomColor(),
  //   // Rendering very strangely when you get close.. no idea why, but I feel like it's not shadows
  //   clipShadows: false,
  //   clippingPlanes: [],
  //   side: THREE.DoubleSide,
  //   depthTest: false,
  // });
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
  // const material = new THREE.MeshPhongMaterial({
  //   color: randomColor(),
  //   // emissive: 0xff4040,
  //   flatShading: false,
  //   side: THREE.DoubleSide,
  // });
  // const mesh = new THREE.Mesh(geometry, material);
  // mesh.castShadow = false;
  // mesh.receiveShadow = false;
  // return mesh;
  // ////////
  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(new THREE.Vector3().toArray(), 3)
  );
  // // geometry.computeBo?phere.radius += 200;
  const material = new THREE.PointsMaterial({
    size: highlight ? 8 : 3,
    dithering: highlight,
    fog: highlight,
    color: highlight ? 0xffffff : randomColor(),
    sizeAttenuation: false, // YASSSS!!
  });
  const object = new THREE.Points(geometry, material);
  //
  // const map = new THREE.TextureLoader().load(
  //   // "https://satellite-bitch.netlify.app/sat.png"
  //   "sat.png"
  // );
  // var texture = textureLoader.load(
  //   "https://secure.gravatar.com/avatar/7c98c58e00b834b9a11255e1c51484a5?s=96&d=mm&r=g",
  //   () => {
  //     // console.log("loaded");
  //   }
  // );
  // const material = new THREE.SpriteMaterial({
  //   map: texture,
  //   color: 0xffffff,
  //   sizeAttenuation: false,
  // });
  // const object = new THREE.Sprite(material);
  // object.scale.set(1, 1, 1);
  // // object.position.set(0, 0, 0);
  object.name = satellite.name;
  return object;
};
