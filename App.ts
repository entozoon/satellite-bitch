import Hero from "./entities/Hero";
import * as THREE from "three";
import { clock, renderer, reset, scene } from "./engine/Renderer";
import { fetchSatellites } from "./engine/Data";
import Satellite from "./entities/Satellite";
export const anaglyphMode = false;
export default class App {
  private font;
  private firstRun = true;
  private hero;
  private satellites = [];
  private updateIteration = 0;
  private updateChunk = 100;
  private fetchData() {
    this.satellites = [];
    [
      // Space stations
      "https://api.allorigins.win/raw?url=https://celestrak.com/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle",
      // GPS
      "https://api.allorigins.win/raw?url=https://celestrak.com/NORAD/elements/gp.php?GROUP=gnss&FORMAT=tle",
      // Weather
      "https://api.allorigins.win/raw?url=https://celestrak.com/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle",
      // Earth Resources (oceanography, cartography, search rescue)
      "https://api.allorigins.win/raw?url=https://celestrak.com/NORAD/elements/gp.php?GROUP=resource&FORMAT=tle",
      // All others
      "https://api.allorigins.win/raw?url=https://celestrak.com/NORAD/elements/gp.php?GROUP=active&FORMAT=tle",
    ].forEach((url) => {
      fetchSatellites(url).then((satellites: any) => {
        satellites
          ?.filter((s) => s.name)
          .forEach((satellite, i) => {
            const s = new Satellite({
              satellite,
              camera: this.hero.ship.object,
              i,
              total: satellites.length,
              highlight: satellite.name === "ISS (ZARYA)",
              font: this.font,
            });
            // Avoid duplication
            if (!this.satellites.find((_) => _.name === s.name)) {
              this.satellites.push(s);
              scene.add(s.object);
              scene.add(s.label);
            }
          });
      });
    });
    setTimeout(() => {
      // console.log(this.satellites.find((s) => s.name === "CORIOLIS"));
      console.log(
        (
          (this.satellites.filter((s) =>
            s.name.toLowerCase().includes("starlink")
          ).length /
            this.satellites.length) *
          100
        ).toFixed(2) + "% of all major satellites are STARLINK"
      );
    }, 10000);
  }
  // private fakeSatellites() {
  //   this.satellites = [];
  //   const total = 1000;
  //   for (let i = 0; i < total; i++) {
  //     this.satellites.push(
  //       new Satellite({
  //         satellite: {},
  //         cameraPosition: this.hero.ship.object.position,
  //         i,
  //         total,
  //       })
  //     );
  //   }
  // }
  constructor({ font }) {
    //
    this.font = font;
    reset();
    renderer.setAnimationLoop(this.loop.bind(this));
    delete this.hero;
    this.hero = new Hero();
    //
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
    earth.name = "earth";
    scene.add(earth);
    //
    // MOON (scale = kilometers)
    const moonGeometry = new THREE.SphereGeometry(1737, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
    });
    // Looking bang down on the north pole
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(0, -384400, 0);
    moon.name = "moon";
    scene.add(moon);
    //
    // this.fakeSatellites();
    // !!
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 24 * 60 * 60 * 1000);
    // !!
    // Raycasting ?
    // Having issues. I mean, it should work.. e.g.
    // https://threejs.org/examples/?q=raycast#webgl_interactive_points
    // And.. it kinda does but
    // I'm diong a single point for each thing rather than a cloud or typical mesh so..
    // const raycaster = new THREE.Raycaster(
    //   undefined,
    //   undefined,
    //   0.0001,
    //   10000000
    // );
    // raycaster.params.Points.threshold = 40; // Gotta be near it?
    // const canvas = document.querySelector("canvas");
    // document.addEventListener("mousemove", (e) => {
    //   e.preventDefault();
    //   const pointer = {
    //     // x: (e.clientX / canvas.width) * 2 - 1,
    //     // y: (e.clientY / canvas.height) * 2 - 1,
    //     x: (e.clientX / window.innerWidth) * 2 - 1,
    //     y: (e.clientY / window.innerHeight) * 2 - 1,
    //   };
    //   raycaster.setFromCamera(pointer, this.hero.camHero.camera);
    //   const intersects = raycaster.intersectObjects(
    //     scene.children
    //     // this.satellites.map((s) => s.object),
    //   );
    //   intersects
    //     .filter((i) => !["earth"].includes(i.object.name))
    //     .forEach((i) => {
    //       console.log(i.object.name);
    //       i.object?.material?.color.set(0xff0000);
    //       // i.object?.material?.colorsNeedUpdate = true;
    //     });
    //   renderer.render(scene, this.hero.camHero.camera);
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
