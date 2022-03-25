import { Vector3 } from "three";
export default class {
  private parent;
  private keys = [
    { keys: ["w"], pressed: false },
    { keys: ["s"], pressed: false },
    { keys: ["a"], pressed: false },
    { keys: ["d"], pressed: false },
    { keys: ["ArrowUp"], pressed: false },
    { keys: ["ArrowDown"], pressed: false },
    { keys: ["ArrowLeft"], pressed: false },
    { keys: ["ArrowRight"], pressed: false },
    // { keys: ["q"], pressed: false },
    // { keys: ["e"], pressed: false },
    { keys: [" "], pressed: false },
    // { keys: ["Shift"], pressed: false },
  ];
  private keysReserved = [].concat.apply(
    [],
    this.keys.map((k) => k.keys)
  );
  private keyFind = (key) => this.keys.find((k) => k.keys.includes(key));
  constructor(parent) {
    this.parent = parent;
    document.body.addEventListener("keydown", this.keydown.bind(this), false);
    document.body.addEventListener("keyup", this.keyup.bind(this), false);
    // document.body.addEventListener(
    //   "mousedown",
    //   (e) => (this.keyFind("w").pressed = true)
    // );
    // document.body.addEventListener(
    //   "mouseup",
    //   (e) => (this.keyFind("w").pressed = false)
    // );
    // document.body.addEventListener(
    //   "gesturestart",
    //   (e: any) => {
    //     console.log(e);
    //     if (e.scale < 1) {
    //       this.keyFind("s").pressed = true;
    //     } else if (e.scale > 1) {
    //       this.keyFind("w").pressed = true;
    //     }
    //   },
    //   false
    // );
    document.body.addEventListener(
      "gesturend",
      (e) => {
        this.keyFind("w").pressed = false;
        this.keyFind("s").pressed = false;
      },
      false
    );
    document.body.addEventListener("wheel", (e) => {
      if (e.deltaY < 0) {
        this.keyFind("w").pressed = true;
      } else if (e.deltaY > 0) {
        this.keyFind("s").pressed = true;
      } else {
        // Argh, there is no end gesture for wheel
        // this.keyFind("w").pressed = false;
        // this.keyFind("s").pressed = false;
      }
    });
  }
  keydown(e) {
    // console.log(e.key);
    const key = this.keyFind(e.key);
    if (!key) return;
    e.stopPropagation();
    e.preventDefault();
    if (!key.pressed) {
      key.pressed = true;
      this.actions();
    }
  }
  keyup(e) {
    const key = this.keyFind(e.key);
    if (!key) return;
    key.pressed = false;
  }
  actions() {
    const {
      position,
      rotation,
    }: // matrixWorld,
    // quaternion,
    {
      position: THREE.Vector3;
      rotation: THREE.Euler;
      // matrixWorld: THREE.Matrix4;
      // quaternion: THREE.Quaternion;
    } = this.parent?.ship?.object || {};
  }
  public update(dt: number) {
    const { ship } = this.parent;
    if (this.keyFind("w").pressed) {
      ship.move("forward", 1);
    }
    if (this.keyFind(" ").pressed) {
      // JIC
      ship.move("forward", 1);
    }
    if (this.keyFind("s").pressed) {
      ship.move("forward", -1);
    }
    // if (this.keyFind("q").pressed) {
    //   ship.move("yaw", -1);
    // }
    // if (this.keyFind("e").pressed) {
    //   ship.move("yaw", 1);
    // }
    if (this.keyFind("ArrowUp").pressed) {
      ship.move("pitch", -1);
    }
    if (this.keyFind("ArrowDown").pressed) {
      ship.move("pitch", 1);
    }
    if (this.keyFind("a").pressed) {
      ship.move("right", -1);
    }
    if (this.keyFind("d").pressed) {
      ship.move("right", 1);
    }
    if (this.keyFind("ArrowLeft").pressed) {
      ship.move("yaw", -1);
    }
    if (this.keyFind("ArrowRight").pressed) {
      ship.move("yaw", 1);
    }
  }
}
