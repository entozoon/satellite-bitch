import Controllable from "../behaviours/Controllable";
import { satelliteObject } from "../objects/Satellite";
export default class {
  public object;
  public controls = new Controllable(this);
  constructor({ satellite, cameraPosition, i, total }) {
    Object.assign(this, satellite);
    this.object = satelliteObject();
    this.cameraPosition = cameraPosition;
    this.i = i;
    this.total = total;
  }
  update(dt) {
    // this.object.position.set(Math.random(), 0, 100000 - Math.random() * 100000);
    this.object.position.set(0, 0, 100000 - (this.i * this.total) / 100000);
    const distanceFromCamera = this.cameraPosition.distanceTo(
      this.object.position
    );
    // console.log(distanceFromCamera); // 25600001
    const scale = 1 + distanceFromCamera;
    if (Math.random() > 0.96) {
      // console.log(this.object.position);
      // console.log(this.cameraPosition);
      // console.log(distanceFromCamera);
    }
    this.object.scale.set(scale, scale, 1);
  }
}
