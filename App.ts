import Hero from "./entities/Hero";
import * as THREE from "three";
import { clock, renderer, reset, scene } from "./engine/Renderer";
import * as satelliteJs from "satellite.js";
import { fetchSatellites } from "./engine/Data";
import { julianToMillis, latLngToXYZUnit } from "./lib/utils";
import Satellite from "./entities/Satellite";
export const anaglyphMode = false;
const attemptStuff = ({ name, tle1, tle2, sat }) => {
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
    if (!positionAndVelocity.position) return;
    // The position_velocity result is a key-value pair of ECI coordinates.
    // These are the base results from which all other coordinates are derived.
    const epoch = new Date(julianToMillis(satrec.jdsatepoch));
    const elapsedSinceEpochMillis = new Date().getTime() - epoch.getTime();
    const daysSinceEpoch = elapsedSinceEpochMillis / 1000 / 60 / 60 / 24;
    const gmst = satelliteJs.gstime(date);
    const positionGeodetic = satelliteJs.eciToGeodetic(
      positionAndVelocity.position as satelliteJs.EciVec3<number>,
      gmst
    );
    console.log(`
position:       ${JSON.stringify(positionAndVelocity.position)}
velocity:       ${JSON.stringify(positionAndVelocity.velocity)}
epoch:          ${epoch.toISOString()}
daysSinceEpoch: ${daysSinceEpoch}
latitude:       ${positionGeodetic.latitude},
longitude:      ${positionGeodetic.longitude},
height(km):     ${positionGeodetic.height}
pos:          ${JSON.stringify(
      latLngToXYZUnit({
        lat: positionGeodetic.latitude,
        lng: positionGeodetic.longitude,
      })
    )}
    `);
    // sat.position.set(0, 0, 100000 - Math.random() * 50);
  }, 100);
};
export default class App {
  private hero;
  private satellites = [];
  private fetchData() {
    fetchSatellites.then((satellites) => {
      this.satellites = satellites.map(
        (satellite, i) =>
          new Satellite({
            satellite,
            cameraPosition: this.hero.ship.object.position,
            i,
          })
      );
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
    const earthMaterial = new THREE.MeshBasicMaterial({ color: 0xaaccff });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    //
    const lightAmbient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(lightAmbient);
    //
    // !!
    // this.fetchData();
    // setInterval(() => {
    //   this.fetchData();
    // }, 24 * 60 * 60 * 1000);
    // !!
    this.fakeSatellites();
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
    this.satellites.forEach((s) => {
      // scene.remove(s.object);
      // Not sure if this is gonna memory leak but I can't seem to clear the scene beforehand. Hopefully doesn't matter (scene children length remains the same)
      scene.add(s.object);
      s.update(dt);
      // s.object.position.set(Math.random(), 0, 100000 - Math.random() * 50);
    });
    renderer.render(scene, this.hero.camHero.camera);
  }
}
