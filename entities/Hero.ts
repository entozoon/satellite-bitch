import Controllable, { initTouchEvents } from "../behaviours/Controllable";
import Camera from "../engine/Camera";
import Ship from "../objects/Ship";
export default class {
  public ship = new Ship({
    // Origin
    // offset: {
    //   x: 0,
    //   y: 0,
    //   z: 100000,
    //   rotation: { x: 0, y: 0, z: 0 },
    // },
    // Alternative
    // offset: {
    //   x: 0,
    //   y: -65000,
    //   z: 20000,
    //   rotation: { x: 1.2, y: 0, z: 0 },
    // },
    // // Testing labels
    // offset: {
    //   x: -1152,
    //   y: 8309,
    //   z: 4138,
    //   rotation: { x: -1.06, y: -0.02, z: -2.68 },
    // },
    // Standard
    offset: {
      x: -2673,
      y: 74631,
      z: 41351,
      rotation: { x: -1.06, y: -0.02, z: -2.68 },
    },
  });
  public camHero = new Camera({
    pov: this.ship.object,
    offset: { x: 0, y: 0, z: 0 },
    addToScene: true,
  });
  public controls = new Controllable(this);
  constructor() {
    initTouchEvents(this.controls);
  }
  public update(dt: number) {
    this.ship.update(dt);
    this.controls.update(dt);
    this.camHero.update(dt);
    // if (Math.random() > 0.9) {
    //   console.log(this.ship.object.position);
    //   console.log(this.ship.object.rotation);
    // }
  }
}
