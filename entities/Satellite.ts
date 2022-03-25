import * as satelliteJs from "satellite.js";
import Controllable from "../behaviours/Controllable";
import { satelliteObject } from "../objects/Satellite";
const calculations = (satellite: any) => {
  const { tle1, tle2 } = satellite;
  if (!tle1 || !tle2) return {};
  // Initialize a satellite record
  var satrec = satelliteJs.twoline2satrec(tle1, tle2);
  //  Propagate satellite using time since epoch (in minutes).
  // const timeSinceTleEpochMinutes = 0; // ?????
  // var positionAndVelocity = satelliteJs.sgp4(satrec, timeSinceTleEpochMinutes);
  //  Or you can use a JavaScript Date
  let date = new Date();
  // date.setSeconds(date.getSeconds() + 60);
  //
  // ^^ ********** !!!? Seems to update naturally, with gmst in positionEci
  //
  const positionAndVelocity = satelliteJs.propagate(satrec, date);
  if (!positionAndVelocity?.position) return {};
  // const { position, velocity } = positionAndVelocity;
  // The position_velocity result is a key-value pair of ECI coordinates.
  // These are the base results from which all other coordinates are derived.
  // const epoch = new Date(julianToMillis(satrec.jdsatepoch));
  // const elapsedSinceEpochMillis = new Date().getTime() - epoch.getTime();
  // const daysSinceEpoch = elapsedSinceEpochMillis / 1000 / 60 / 60 / 24;
  const gmst = satelliteJs.gstime(date);
  const positionEci = satelliteJs.eciToEcf(
    positionAndVelocity.position as satelliteJs.EciVec3<number>,
    gmst
  );
  // const positionGeodetic = satelliteJs.eciToGeodetic(
  //   positionAndVelocity.position as satelliteJs.EciVec3<number>,
  //   gmst
  // );
  // const { latitude, longitude, height } = positionGeodetic;
  // const positionXYZ = latLngHeightToXYZ({
  //   latitude,
  //   longitude,
  //   height,
  // });
  // console.log(`
  // position:       ${JSON.stringify(position)}
  // velocity:       ${JSON.stringify(velocity)}
  // epoch:          ${epoch.toISOString()}
  // daysSinceEpoch: ${daysSinceEpoch}
  // latitude:       ${positionGeodetic.latitude},
  // longitude:      ${positionGeodetic.longitude},
  // height(km):     ${positionGeodetic.height}
  // pos:          ${JSON.stringify(positionXYZ)}
  //     `);
  //
  // daysSinceEpoch: 1.1428453472222222
  // epoch: Thu Mar 24 2022 13:10:26
  // height: 422.0512419750612
  // latitude: 0.6977213518740087
  // longitude: -0.01318271195123244
  // position: {x: 1664, y: 4945, z: 4347}
  // positionXYZ: {x: -0.01, y: 0.64, z: 0.766}
  // velocity: {x: -6.78, y: -0.768, z: 3.468}
  return {
    // daysSinceEpoch,
    // epoch,
    // height,
    // latitude,
    // longitude,
    // position,
    positionEci,
    // positionXYZ,
    // velocity,
  };
};
export default class {
  public name;
  public object;
  public controls = new Controllable(this);
  public cameraPosition;
  public i;
  public total;
  constructor({ satellite, cameraPosition, i, total, highlight = false }) {
    Object.assign(this, satellite);
    this.object = satelliteObject(highlight);
    this.cameraPosition = cameraPosition;
    this.i = i;
    this.total = total;
  }
  update(dt) {
    this.calculations = calculations(this);
    if (!this.calculations?.positionEci?.x) return;
    // this.object.position.set(0, 0, (this.i / this.total) * 100000);
    // Works but doesn't factor in height:
    // const earthRadius = 6371;
    // const x = this.calculations.positionXYZ?.x * earthRadius;
    // const y = this.calculations.positionXYZ?.y * earthRadius;
    // const z = this.calculations.positionXYZ?.z * earthRadius;
    this.object.position.set(
      this.calculations.positionEci.x,
      this.calculations.positionEci.y,
      this.calculations.positionEci.z
    );
    const distanceFromCamera = this.cameraPosition.distanceTo(
      this.object.position
    );
    // console.log(distanceFromCamera); // 25600001
    const scale = 1 + distanceFromCamera;
    // if (this.i === 1 && Math.random() > 0.99) {
    // if (firstRun) {
    // console.log(this.object.position);
    // console.log(this.cameraPosition);
    // console.log(distanceFromCamera);
    // console.log(this.calculations);
    // console.log(this);
    // }
    this.object.scale.set(scale, scale, 1);
  }
}
