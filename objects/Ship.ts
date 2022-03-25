import { scene } from "../engine/Renderer";
import * as THREE from "three";
import { Vector3 } from "three";
import { between } from "../lib/utils";
const createTorch = () => {
  //  SpotLight / DirectionalLight / PointLight
  const torch = new THREE.SpotLight(0xffffff, 1);
  torch.castShadow = true;
  torch.shadow.camera.near = 100; // default .5 (flickering)
  // torch.shadow.camera.far = 1000; // default 500
  return torch;
};
export default class {
  public object: THREE.Object3D;
  public camera: THREE.Camera;
  private torch;
  private impulses = {
    forward: {
      speed: 0, // m/s
      acceleration: 2,
      drag: 1,
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
  constructor({ offset }: { offset?: { x: number; y: number; z: number } }) {
    const shipGeometry = new THREE.BoxGeometry(6, 1, 2);
    this.object = new THREE.Mesh(
      shipGeometry,
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide, // debug only
        color: 0xaaaaaa,
        // wireframe: true,
      })
    );
    this.object.castShadow = true;
    this.object.receiveShadow = true;
    this.object.position.x = offset?.x || 0;
    this.object.position.y = offset?.y || 0;
    this.object.position.z = offset?.z || 0;
    scene.add(this.object);
    this.torch = createTorch();
    // offset from this.object (ship)
    this.torch.position.z = -5;
    this.torch.target.position.z = -20;
    this.object.add(this.torch, this.torch.target);
    //
  }
  public move(direction, sign = 1) {
    this.impulses[direction].speed +=
      this.impulses[direction].acceleration * sign;
  }
  public fire() {
    const raycaster = new THREE.Raycaster();
    // Probs work different when I get it casting to the plane mesh
    // raycaster.params.Line.threshold = 999;
    // raycaster.params.Points.threshold = 999;
    raycaster.setFromCamera(new Vector3(0, 0, 0), this.camera);
    const intersects = raycaster.intersectObjects(scene.children);
    // intersects.forEach((intersect) => {
    //   intersect.object?.material?.color.set(0xffffff);
    // });
    // console.log(intersects);
    intersects[0]?.object.material?.color.set(0xffffff);
    this.cylinderFuckery();
  }
  cylinderFuckery() {
    const cylinderLength = 100;
    const cylinder = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(
        ...Object.values({
          radiusTop: 4,
          radiusBottom: 4,
          height: cylinderLength,
          radialSegments: 3,
        })
      ),
      new THREE.MeshPhongMaterial({
        color: 0xffaa00,
      })
    );
    let axis = this.object.rotation.toVector3();
    // oooooh, I do have a cheeky idea!
    // have the object always exist, but invisible.. rotating the same as the ship. So stupid though.
    // I'm really starting to hate the non-absolute nature of threejs
    console.log(axis);
    // axis.z += 1;
    // cylinder.rotateOnAxis(this.object.rotation.toVector3(), 2);
    // cylinder.rotateOnAxis(new Vector3(0, 0, 1), 2);
    cylinder.rotateOnAxis(axis, 2);
    // cylinder.rotation = this.object.rotation;

    // cylinder.position.x = this.object.position.x;
    // cylinder.position.y = this.object.position.y;
    // cylinder.position.z = this.object.position.z - cylinderLength / 2;
    scene.add(cylinder);
    setTimeout(() => {
      scene.remove(cylinder);
    }, 1000);
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
