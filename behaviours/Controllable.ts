import { Vector3 } from "three";
export default class {
  private parent;
  public keys = [
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
  keyFind = (key) => this.keys.find((k) => k.keys.includes(key));
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
    // document.body.addEventListener(
    //   "gesturend",
    //   (e) => {
    //     this.keyFind("w").pressed = false;
    //     this.keyFind("s").pressed = false;
    //   },
    //   false
    // );
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
const directionKeycodeFromTouchPos = ({ x, y, width, height }) => {
  // Much improved rewrite, with advice from https://gist.github.com/fbacall
  let keyCode = "none";
  const relX = x - width / 2;
  const relY = y - height / 2;
  if (Math.abs(relY) > Math.abs(relX)) {
    keyCode = relY < 0 ? "w" : "s";
  } else {
    keyCode = relX > 0 ? "ArrowRight" : "ArrowLeft";
  }
  return keyCode;
};
export const initTouchEvents = (controls) => {
  document.body.addEventListener("touchstart", (e) => {
    e.preventDefault(); // plus user-select: none;
    const dir = directionKeycodeFromTouchPos({
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });
    controls.keyFind(dir).pressed = true;
    setTimeout(() => {
      kill(); // JIC
    }, 3000);
  });
  const kill = () => {
    controls.keyFind("w").pressed = false;
    controls.keyFind("s").pressed = false;
    controls.keyFind("ArrowLeft").pressed = false;
    controls.keyFind("ArrowRight").pressed = false;
  };
  document.body.addEventListener("touchend", (e) => {
    kill();
  });
  // Wheel was aight on dekstop, but no joy on mobile. Should have tankbladed earlier!
  // document.body.addEventListener(
  //   "wheel",
  //   (e) => {
  //     e.preventDefault();
  //     // Two-finger scroll
  //     // if (Math.random() > 0.99) console.log(e.deltaY);
  //     // Debounce can't be (this.) because the scope is lost
  //     // Also argh, there is no end gesture for wheel
  //     if (e.deltaY || e.deltaX) {
  //       if (e.deltaY > 0) {
  //         clearTimeout((window as any).touchDebounceForward);
  //         controls.keyFind("w").pressed = true;
  //         (window as any).touchDebounceForward = setTimeout(() => {
  //           controls.keyFind("w").pressed = false;
  //         }, 100);
  //       } else if (e.deltaY < 0) {
  //         clearTimeout((window as any).touchDebounceBackward);
  //         controls.keyFind("s").pressed = true;
  //         (window as any).touchDebounceBackward = setTimeout(() => {
  //           controls.keyFind("s").pressed = false;
  //         }, 100);
  //       }
  //       if (e.deltaX > 20) {
  //         clearTimeout((window as any).touchDebounceLeft);
  //         controls.keyFind("ArrowLeft").pressed = true;
  //         (window as any).touchDebounceLeft = setTimeout(() => {
  //           controls.keyFind("ArrowLeft").pressed = false;
  //         }, 100);
  //       } else if (e.deltaX < -20) {
  //         clearTimeout((window as any).touchDebounceRight);
  //         controls.keyFind("ArrowRight").pressed = true;
  //         (window as any).touchDebounceRight = setTimeout(() => {
  //           controls.keyFind("ArrowRight").pressed = false;
  //         }, 100);
  //       }
  //     }
  //   },
  //   { passive: false }
  // );
};
