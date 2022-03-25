import Hero from "./entities/Hero";
import * as THREE from "three";
import { clock, renderer, reset, scene } from "./engine/Renderer";
export const anaglyphMode = false;
export default class App {
  private hero;
  private cubeSpinner;
  constructor() {
    reset();
    renderer.setAnimationLoop(this.loop.bind(this));
    delete this.hero;
    this.hero = new Hero();
    //
    // GUFF
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    this.cubeSpinner = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide, // debug only
        color: 0x00aa55,
      })
    );
    this.cubeSpinner.castShadow = true;
    this.cubeSpinner.receiveShadow = true;
    this.cubeSpinner.position.set(0, 0, -100);
    scene.add(this.cubeSpinner);
    for (let i = 0; i < 100; i++) {
      const cube = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide, // debug only
          color: 0xff0000,
        })
      );
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.position.set(
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500
      );
      scene.add(cube);
    }
    //
    const lightAmbient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(lightAmbient);
  }
  loop(time) {
    const dt = clock.getDelta(); // Always use this
    this.hero.update(dt);
    renderer.render(scene, this.hero.camHero.camera);
    this.cubeSpinner.rotateOnAxis(new THREE.Vector3(0, 1, 0), dt * 0.5);
  }
}
