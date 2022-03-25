import Hero from "./entities/Hero";
import * as THREE from "three";
import { clock, renderer, reset, scene } from "./engine/Renderer";
import { fetchSatellites } from "./engine/Data";
import Satellite from "./entities/Satellite";
export const anaglyphMode = false;
export default class App {
  private firstRun = true;
  private hero;
  private satellites = [];
  private updateIteration = 0;
  private updateChunk = 100;
  private fetchData() {
    fetchSatellites.then((satellites: any) => {
      this.satellites = satellites.map(
        (satellite, i) =>
          new Satellite({
            satellite,
            cameraPosition: this.hero.ship.object.position,
            i,
            total: satellites.length,
          })
      );
      this.satellites.forEach((s) => {
        scene.add(s.object);
      });
    });
  }
  private fakeSatellites() {
    this.satellites = [];
    const total = 1000;
    for (let i = 0; i < total; i++) {
      this.satellites.push(
        new Satellite({
          satellite: {},
          cameraPosition: this.hero.ship.object.position,
          i,
          total,
        })
      );
    }
  }
  constructor() {
    //
    reset();
    renderer.setAnimationLoop(this.loop.bind(this));
    delete this.hero;
    this.hero = new Hero();
    //
    // EARTH (scale = kilometers)
    const earthGeometry = new THREE.SphereGeometry(6371, 32, 32);
    const earthMaterial = new THREE.MeshBasicMaterial({
      color: 0x112233,
      wireframe: true,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    //
    // const lightAmbient = new THREE.AmbientLight(0xffffff, 1);
    // scene.add(lightAmbient);
    //
    // this.fakeSatellites();
    // !!
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 24 * 60 * 60 * 1000);
    // !!
    //
    // attemptStuff({
    //   name: "ISS (ZARYA)",
    //   tle1: "1 25544U 98067A   22084.12316441  .00006730  00000+0  12782-3 0  9996",
    //   tle2: "2 25544  51.6446  32.9367 0004076 310.4490 170.3824 15.49536326332148",
    //   sat,
    // });
  }
  loop(time) {
    const dt = clock.getDelta(); // Always use this
    this.hero.update(dt);
    // scene.children?.forEach((child) => {
    //   scene.remove(child);
    // });
    this.satellites.forEach((s, i) => {
      if (
        // this.firstRun ||
        (this.updateIteration < i &&
          i < this.updateIteration + this.updateIteration) ||
        this.satellites.length - this.updateIteration < this.updateChunk
      ) {
        // scene.remove(s.object);
        // Not sure if this is gonna memory leak but I can't seem to clear the scene beforehand. Hopefully doesn't matter (scene children length remains the same)
        // scene.add(s.object);
        s.update(dt);
      }
    });
    this.updateIteration =
      this.updateIteration >= this.satellites.length
        ? 0
        : this.updateIteration + this.updateChunk;
    // console.log(this.updateIteration);
    renderer.render(scene, this.hero.camHero.camera);
    if (this.firstRun) {
      setTimeout(() => {
        this.firstRun = false;
      }, 0);
    }
  }
}
