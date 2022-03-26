import { labelObject } from "../objects/labelObject";
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
  public label;
  public controls = new Controllable(this);
  public camera;
  public i;
  public total;
  public font;
  constructor({ satellite, camera, i, total, highlight = false, font }) {
    Object.assign(this, satellite);
    this.object = satelliteObject(satellite, highlight);
    this.label = labelObject({
      name: satellite.name,
      color: this.object.material.color,
      font,
    });
    this.camera = camera;
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
    const distanceFromCamera = this.camera.position.distanceTo(
      this.object.position
    );
    this.object.position.set(
      this.calculations.positionEci.x,
      this.calculations.positionEci.y,
      this.calculations.positionEci.z
    );
    const scale = 1 + distanceFromCamera;
    this.object.scale.set(scale, scale, 1);
    if (distanceFromCamera < 2000) {
      this.label.position.set(
        this.calculations.positionEci.x,
        this.calculations.positionEci.y,
        this.calculations.positionEci.z
      );
      this.label.rotation.set(
        this.camera.rotation.x,
        this.camera.rotation.y,
        this.camera.rotation.z
      );
      this.label.visible = true;
    } else this.label.visible = false;
    // this.label.scale.set(scale / 10000, scale / 10000, 1); // Not sure if I like no sizeAttenuation for text..
  }
}
