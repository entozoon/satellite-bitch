import Controllable, { initTouchEvents } from "../behaviours/Controllable";
import Camera from "../engine/Camera";
import Ship from "../objects/Ship";
export default class {
  public ship = new Ship({
    // offset: {
    //   x: 0,
    //   y: 0,
    //   z: 100000,
    //   rotation: { x: 0, y: 0, z: 0 },
    // },
    // offset: {
    //   x: 0,
    //   y: -65000,
    //   z: 20000,
    //   rotation: { x: 1.2, y: 0, z: 0 },
    // },
    offset: {
      x: -2673,
      y: 74631,
      z: 41351,
      rotation: { x: -1.06, y: -0.02, z: -2.68 },
    },
    // 3 {x: -2673.680035021083, y: 74631.2290190338, z: 41351.30947174185}
    // Hero.ts:30 Euler {_x: -1.0594221018829997, _y: -0.024351071671064435, _z: -2.689072841845536, _order: 'XYZ', _onChangeCallback: ƒ}
  });
  public camHero = new Camera({
    pov: this.ship.object,
    offset: { x: 0, y: 0, z: 0 },
    addToScene: true,
  });
  // public camShip = new Camera({
  //   pov: this.ship.object,
  //   offset: { x: 0, y: 0, z: -5 },
  //   addToScene: false,
  // });
  public controls = new Controllable(this);
  constructor() {
    // this.ship.camera = this.camShip.camera;
    initTouchEvents(this.controls);
  }
  public update(dt: number) {
    this.ship.update(dt);
    this.controls.update(dt);
    this.camHero.update(dt);
    // this.camShip.update(dt);
    // if (Math.random() > 0.9) {
    //   console.log(this.ship.object.position);
    //   console.log(this.ship.object.rotation);
    // }
  }
}
