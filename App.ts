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
    this.satellites = [];
    fetchSatellites(
      "https://api.allorigins.win/raw?url=https://celestrak.com/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle"
    )
      .then((satellites: any) => {
        satellites.forEach((satellite, i) => {
          const s = new Satellite({
            satellite,
            cameraPosition: this.hero.ship.object.position,
            i,
            total: satellites.length,
            highlight: satellite.name === "ISS (ZARYA)",
          });
          this.satellites.push(s);
        });
      })
      .then(() =>
        fetchSatellites(
          "https://api.allorigins.win/raw?url=https://celestrak.com/NORAD/elements/gp.php?GROUP=active&FORMAT=tle"
        )
      )
      .then((satellites: any) => {
        satellites.forEach((satellite, i) => {
          const s = new Satellite({
            satellite,
            cameraPosition: this.hero.ship.object.position,
            i,
            total: satellites.length,
          });
          // Avoid duplication
          if (this.satellites.find((_) => _.name === s.name)) return;
          this.satellites.push(s);
        });
      })
      .finally(() => {
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
    const earthGeometry = new THREE.SphereGeometry(6371, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      // Bloody hell, DoubleSide translucent spheres are just not  possible no matter what I try!
      // color: 0x112233,
      color: 0xaaccff,
      // side: THREE.DoubleSide,
      opacity: 0.05,
      transparent: true,
      wireframe: true,
      // blending: THREE.AdditiveBlending,
      // metalness: 0.5,
      // shininess: 100,
      // flatShading: true,
      // vertexColors: true,
      // depthWrite: true,
    });
    // Looking bang down on the north pole
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.set(Math.PI / 2, 0, 0);
    scene.add(earth);
    //
    // this.fakeSatellites();
    // !!
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 24 * 60 * 60 * 1000);
    // !!
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
