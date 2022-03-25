import * as THREE from "three";
import { Vector3 } from "three";
import { scene } from "./Renderer";
export default class {
  public camera: THREE.Camera;
  public cameraShip: THREE.Camera;
  pov: THREE.Object3D;
  constructor({
    pov,
    offset,
    addToScene,
  }: {
    pov?: THREE.Object3D;
    offset?: { x: number; y: number; z: number };
    addToScene: boolean;
  }) {
    this.pov = pov;
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight
    ); //      ⭡y
    //       z ↙⭢ x
    addToScene && scene.add(this.camera);
    this.camera.position.x = offset?.x || 0; // *A*
    this.camera.position.y = offset?.y || 0; // *A*
    this.camera.position.z = offset?.z || 0; // *A*
    pov?.add(this.camera); // *A*
  }
  public update(dt: number) {
    // let { position, rotation } = this.pov?.clone();
    // const rotationUnit = rotation.toVector3().normalize();
    // const x =
    //   position.x + Math.sin(rotation.y) * 30 + Math.sin(rotation.x) * 30;
    // const z = position.z + Math.cos(rotation.y) * 30; // + Math.cos(rotation.x) * 30;
    // const y = position.y - Math.sin(rotation.x) * 30;
    // position.add(new Vector3(x, y, z));
    // // position.add(rotationUnit.negate().multiplyScalar(20));
    // this.camera.position.set(...position.toArray());
    // // // this.camera.rotation.set(-0.2, 0, 0);
    // // this.camera.rotation.setFromVector3(rotation.toVector3());
    // this.camera.position.set(0, 0, 30);
    //
    // const pos = position.sub(rotation.toVector3().multiplyScalar(30)).toArray();
    // // console.log(pos);
    // var cwd = new Vector3();
    // this.pov.getWorldDirection(cwd);
    // console.log(this.pov.rotation.toArray());
    // // cwd.multiplyScalar(dist);
    // this.camera.position.set(...pos);
    // this.camera.translateOnAxis(rotation.toVector3(), 30);
    // const wtf = rotation.toVector3().normalize();
    // .multiply(new Vector3(1, 1, 30));
    // const erm = transformDirection;
    // this.camera.position.z = Math.cos(this.pov.rotation.y) * 30;
    //
    //
    //
    // // Probably could use this now, with sin or vector functions to manually place it in order to swoop around after the object.
    // // I'd have to remove the various *A* items but hopefully can figure out an alternative what with the camera bound to the pov
    // this.camera.setRotationFromEuler(rotation); // ****
    // this.pov.rotation.order = "YXZ"; // !!
    // if (Math.random() > 0.9) {
    //   // Okay, so Euler angles are fucky. y is different, it's all pitch madness
    //   // https://stackoverflow.com/a/28569296/3098773
    //   console.log(this.pov.rotation);
    // }
  }
}
