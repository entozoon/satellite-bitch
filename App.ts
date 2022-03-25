import Hero from "./entities/Hero";
import * as THREE from "three";
import { clock, renderer, reset, scene } from "./engine/Renderer";
import axios from "axios";
import * as satelliteJs from "satellite.js";
import chunk from "lodash/chunk";
export const anaglyphMode = false;
const julianToMillis = (julian) => (julian - 2440587.5) * 86400000;
const attemptStuff = ({ name, tle1, tle2 }) => {
  // Initialize a satellite record
  var satrec = satelliteJs.twoline2satrec(tle1, tle2);
  //  Propagate satellite using time since epoch (in minutes).
  // const timeSinceTleEpochMinutes = 0; // ?????
  // var positionAndVelocity = satelliteJs.sgp4(satrec, timeSinceTleEpochMinutes);
  //  Or you can use a JavaScript Date
  let date = new Date();
  setInterval(() => {
    date.setSeconds(date.getSeconds() + 60);
    const positionAndVelocity = satelliteJs.propagate(satrec, date);
    // The position_velocity result is a key-value pair of ECI coordinates.
    // These are the base results from which all other coordinates are derived.
    const positionEci = positionAndVelocity.position,
      velocityEci = positionAndVelocity.velocity;
    const epoch = new Date(julianToMillis(satrec.jdsatepoch));
    const elapsedSinceEpochMillis = new Date().getTime() - epoch.getTime();
    const elapsedSinceEpochDays = elapsedSinceEpochMillis / 1000 / 60 / 60 / 24;
    console.log(`
    positionAndVelocity: ${JSON.stringify(positionAndVelocity)}
    positionEci: ${JSON.stringify(positionEci)}
    velocityEci: ${JSON.stringify(velocityEci)}
    epoch: ${epoch.toISOString()}
    elapsedSinceEpochDays: ${elapsedSinceEpochDays}
  `);
  }, 1000);
};
export default class App {
  private hero;
  private cubeSpinner;
  public data;
  fetchData() {
    axios
      .get(
        // "https://api.allorigins.win/raw?url=http://www.celestrak.com/NORAD/elements/active.txt"
        "https://api.allorigins.win/raw?url=https://celestrak.com/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle"
        // ISS (ZARYA)
        // 1 25544U 98067A   22084.12316441  .00006730  00000+0  12782-3 0  9996
        // 2 25544  51.6446  32.9367 0004076 310.4490 170.3824 15.49536326332148
      )
      .then((res) => res?.data)
      .then((data) => {
        // [ "ISS (ZARYA)",
        //   "1 25544U 98067A   22084.12316441  .00006730  00000+0  12782-3 0  9996",
        //   "2 25544  51.6446  32.9367 0004076 310.4490 170.3824 15.49536326332148", ]
        const chunks = chunk(
          data.split("\n").map((l) => l.replace("\n", "")),
          3
        );
        return chunks.map((chunk) => ({
          name: chunk[0],
          tle1: chunk[1],
          tle2: chunk[2],
        }));
      })
      .then((satellites) => {
        satellites.forEach(({ name, tle1, tle2 }) => {
          attemptStuff({ name, tle1, tle2 });
        });
      });
  }
  constructor() {
    // setInterval ..
    // this.fetchData();
    attemptStuff({
      name: "ISS (ZARYA)",
      tle1: "1 25544U 98067A   22084.12316441  .00006730  00000+0  12782-3 0  9996",
      tle2: "2 25544  51.6446  32.9367 0004076 310.4490 170.3824 15.49536326332148",
    });
    //
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
