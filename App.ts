import Hero from "./entities/Hero";
import * as THREE from "three";
import { clock, renderer, reset, scene } from "./engine/Renderer";
import axios from "axios";
import * as satelliteJs from "satellite.js";
import chunk from "lodash/chunk";
export const anaglyphMode = false;
const julianToMillis = (julian) => (julian - 2440587.5) * 86400000;
// https://gist.github.com/nicoptere/2f2571db4b454bb18cd9
const latLngToXYZUnit = ({ lat, lng }) => {
  // flips the Y axis
  lat = Math.PI / 2 - lat;
  // distribute to sphere
  return {
    x: Math.sin(lat) * Math.sin(lng),
    y: Math.cos(lat),
    z: Math.sin(lat) * Math.cos(lng),
  };
};
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
    sat.position.set(0, 0, 100000 - Math.random() * 50);
  }, 100);
};
export default class App {
  private hero;
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
        // satellites.forEach(({ name, tle1, tle2 }) => {
        //   attemptStuff({ name, tle1, tle2 });
        // });
      });
  }
  constructor() {
    // setInterval ..
    // this.fetchData();
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
    const sat = new THREE.Mesh(satGeometry, satMaterial);
    scene.add(sat);
    attemptStuff({
      name: "ISS (ZARYA)",
      tle1: "1 25544U 98067A   22084.12316441  .00006730  00000+0  12782-3 0  9996",
      tle2: "2 25544  51.6446  32.9367 0004076 310.4490 170.3824 15.49536326332148",
      sat,
    });
  }
  loop(time) {
    const dt = clock.getDelta(); // Always use this
    this.hero.update(dt);
    renderer.render(scene, this.hero.camHero.camera);
  }
}
