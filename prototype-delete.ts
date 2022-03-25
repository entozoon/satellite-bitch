// import * as THREE from "three";
// import { AnaglyphEffect } from "./AnaglyphEffect.js.js";
// const anaglyphMode = false;
// export default class App {
//   scene: THREE.Scene;
//   camera: THREE.Camera;
//   rendererOrEffect: THREE.WebGLRenderer;
//   effect;
//   box: THREE.BoxGeometry;
//   planeMesh: THREE.Mesh;
//   planeGrid: THREE.Mesh;
//   light1;
//   lightbox1;
//   light2;
//   lightbox2;
//   constructor({ wrapper }: { wrapper: HTMLElement }) {
//     this.scene = new THREE.Scene();
//     this.camera = new THREE.PerspectiveCamera(
//       70,
//       window.innerWidth / window.innerHeight,
//       0.01,
//       1000
//     ); //      ⭡y
//     //       z ↙⭢ x
//     this.camera.position.set(0, 0, 100);
//     this.camera.rotation.set(0, 0, 0);
//     const planeGeometry = new THREE.PlaneGeometry(100, 100, 100, 100); // 1 unit = 1 meter,
//     for (
//       let i = 0;
//       i < planeGeometry.attributes.position.array.length;
//       i += 3
//     ) {
//       // @ts-ignore
//       planeGeometry.attributes.position.array[i + 2] =
//         Math.sin(i / 1000) * 2 + Math.random() * 2; // x, y, z++
//     }
//     //
//     // FILL (these things can be grouped together. Maybe whole planet)
//     const materialFill = new THREE.MeshPhongMaterial({
//       color: 0x66ff66,
//       side: THREE.DoubleSide, // debug only
//       // shininess: 50,
//     });
//     this.planeMesh = new THREE.Mesh(planeGeometry, materialFill);
//     this.planeMesh.castShadow = true;
//     this.planeMesh.receiveShadow = true;
//     this.planeMesh.position.set(0, 0, 0);
//     this.planeMesh.rotation.set(Math.PI / 2 + 0.3, 0, 0);
//     this.scene.add(this.planeMesh);
//     //
//     const lightAmbient = new THREE.AmbientLight(0xffffff, 0.05);
//     this.scene.add(lightAmbient);
//     //
//     this.light2 = new THREE.SpotLight(0xffffff, 1);
//     this.light2.castShadow = true;
//     // this.light2.shadow.camera.near = 1; // default .5
//     this.light2.shadow.camera.far = 10; // default 500
//     this.light2.position.set(5, 5, 0);
//     this.scene.add(this.light2);
//     const lightbox2Geometry = new THREE.BoxGeometry(1, 1, 1);
//     const lightbox2Material = new THREE.MeshBasicMaterial({ color: 0xffffff });
//     this.lightbox2 = new THREE.Mesh(lightbox2Geometry, lightbox2Material);
//     this.lightbox2.position.set(5, 5, 0);
//     this.scene.add(this.lightbox2);
//     // const helper = new THREE.CameraHelper(this.light2.shadow.camera);
//     // this.scene.add(helper);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       // precision: "lowp", // optimisation
//       failIfMajorPerformanceCaveat: true,
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.shadowMap.enabled = true;
//     // renderer.shadowMap.type = THREE.BasicShadowMap;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.setAnimationLoop(this.animation.bind(this));
//     wrapper.querySelector("canvas")?.remove();
//     wrapper.appendChild(renderer.domElement);
//     this.rendererOrEffect = anaglyphMode
//       ? new AnaglyphEffect(renderer)
//       : renderer;
//   }
//   animation(time) {
//     // this.planeMesh.rotation.y = time / 2000;
//     this.lightbox2?.position.set(
//       Math.cos(-time / 1000) * 70,
//       Math.sin(time / 1000) * 70,
//       5
//     );
//     this.light2?.position.set(
//       Math.cos(-time / 1000) * 70,
//       Math.sin(time / 1000) * 70,
//       5
//     );
//     this.rendererOrEffect.render(this.scene, this.camera);
//   }
// }
