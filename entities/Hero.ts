import { Vector3 } from "three";
import Controllable from "../behaviours/Controllable";
import Camera from "../engine/Camera";
import Ship from "../objects/Ship";
export default class {
  public ship = new Ship({
    offset: { x: 0, y: 0, z: 50 },
  });
  public camHero = new Camera({
    pov: this.ship.object,
    offset: { x: 0, y: 2, z: 10 },
    addToScene: true,
  });
  public camShip = new Camera({
    pov: this.ship.object,
    offset: { x: 0, y: 0, z: -5 },
    addToScene: false,
  });
  public controls = new Controllable(this);
  constructor() {
    this.ship.camera = this.camShip.camera;
  }
  public update(dt: number) {
    this.ship.update(dt);
    this.controls.update(dt);
    this.camHero.update(dt);
    this.camShip.update(dt);
  }
}
