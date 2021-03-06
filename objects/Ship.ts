import { scene } from "../engine/Renderer";
import * as THREE from "three";
import { Vector3 } from "three";
import { between } from "../lib/utils";
export default class {
  public object: THREE.Object3D;
  public camera: THREE.Camera;
  private impulses = {
    forward: {
      speed: 0, // m/s
      acceleration: 1000,
      drag: 500,
    },
    right: {
      speed: 0, // m/s
      acceleration: 1000,
      drag: 500,
    },
    yaw: {
      speed: 0,
      acceleration: 0.2,
      drag: 0.1,
    },
    pitch: {
      speed: 0,
      acceleration: 0.2,
      drag: 0.1,
    },
    roll: {
      speed: 0,
      acceleration: 0.2,
      drag: 0.1,
    },
  };
  constructor({
    offset,
  }: {
    offset?: { x: number; y: number; z: number; rotation: number };
  }) {
    const shipGeometry = new THREE.BoxGeometry(0.04, 0.02, 0.02);
    this.object = new THREE.Mesh(
      shipGeometry,
      // new THREE.MeshPhongMaterial({
      //   side: THREE.DoubleSide, // debug only
      //   color: 0xffaa77,
      //   wireframe: true,
      // })
      new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true,
      })
    );
    this.object.castShadow = false;
    this.object.receiveShadow = false;
    this.object.position.x = offset?.x || 0;
    this.object.position.y = offset?.y || 0;
    this.object.position.z = offset?.z || 0;
    this.object.rotation.set(
      offset?.rotation?.x,
      offset?.rotation?.y,
      offset?.rotation?.z
    );
    scene.add(this.object);
    //
  }
  public move(direction, sign = 1) {
    this.impulses[direction].speed +=
      this.impulses[direction].acceleration * sign;
  }
  update(dt: number) {
    for (const direction in this.impulses) {
      const impulse = this.impulses[direction];
      // impulse.speed -= impulse.drag;
      impulse.speed =
        impulse.speed === 0
          ? impulse.speed
          : impulse.speed - impulse.drag * Math.sign(impulse.speed);
      // Gets flappy, so snap to 0 in like -.1->.1 (based on drag value)
      impulse.speed = between(impulse.speed, -impulse.drag, impulse.drag)
        ? 0
        : impulse.speed;
    }
    this.object.translateZ(-this.impulses.forward.speed * dt);
    this.object.translateX(this.impulses.right.speed * dt);
    this.object.rotateOnAxis(
      new Vector3(0, -1, 0),
      this.impulses.yaw.speed * dt
    );
    this.object.rotateOnAxis(
      new Vector3(1, 0, 0),
      this.impulses.pitch.speed * dt
    );
    this.object.rotateOnAxis(
      new Vector3(0, 0, -1),
      this.impulses.roll.speed * dt
    );
    // if (Math.random() > 0.9) {
    //   console.log(
    //     this.impulses.forward.speed
    //     // dt,
    //     // Math.sign(this.impulses.forward.speed)
    //   );
    //   // console.log(this.impulses);
    // }
  }
}
