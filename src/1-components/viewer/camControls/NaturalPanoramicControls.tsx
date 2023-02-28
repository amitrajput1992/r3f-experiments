// NaturalPanoramicControls, camera controls
//
// Dragging your mouse (or panning with your finger) will rotate the camera such
// that the point under your cursor in the world follows your mouse as it is
// being dragged.
//
// Assumptions:
// 1) the camera position is (0, 0, 0);
// 2) the camera.up vector is (0, 1, 0);
// 3) the camera looks through (0, 0, -1);
import { Euler, Matrix3, PerspectiveCamera, Vector2, Vector3 } from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import React, { useRef } from 'react';

/**
 * execute functions in a sequence
 * @param fns
 * @returns {function(*=)}
 */
const flow = (fns: any[]) => {
  return (x: any) => fns.reduce((acc, f) => f(acc), x);
};

const {
  abs,
  sqrt,
  max,
  min,
  PI,
  pow
} = Math;

const FRICTION = 0.00000250;
const MAX_ROTATIONAL_SPEED = 2 * PI / 3000;
const bounded = (lower: number, x: number, upper: number) => max(lower, min(x, upper));

/**
 * calculate the delta based on the initial velocity and the time difference between drags
 * @param startTimeFloat
 * @param prevTimeFrame
 * @param currentTimeFrame
 * @param initialVelocity
 * @param friction
 */
export function dxConstantFriction(startTimeFloat: number, prevTimeFrame: number, currentTimeFrame: number, initialVelocity: number, friction: number = FRICTION) {
  let timeInitial = prevTimeFrame - startTimeFloat;
  let timeFinal = currentTimeFrame - startTimeFloat;
  let timeFinal2 = timeFinal * timeFinal;
  let timeInitial2 = timeInitial * timeInitial;

  // Drag cannot make you go backward.
  return max(0, initialVelocity * (timeFinal - timeInitial) - friction * (timeFinal2 - timeInitial2));
}

/**
 * convert pixels to canvas coordinates
 * in x, y axis
 * @param camera
 * @param state
 * @returns {function(*)}
 */
export const fromPixelsToFilm2 = (camera: PerspectiveCamera, state: {width: number, height: number}) => {
  const vectorPixelsC = new Vector2();
  const vectorFilm2 = new Vector2();

  return (vectorPixels: Vector2) => {
    const width = state.width;
    const height = state.height;
    const filmWidth = camera.getFilmWidth();
    const filmHeight = camera.getFilmHeight();

    const ox = width / 2;
    const oy = height / 2;
    const sx = width / filmWidth;
    const sy = -height / filmHeight;

    vectorPixelsC.set(
      vectorPixels.x - ox,
      vectorPixels.y - oy,
    );

    vectorFilm2.set(
      (vectorPixels.x - ox) / sx,
      (vectorPixels.y - oy) / sy,
    );

    return vectorFilm2;
  };
};

/**
 * Convert the 2D vector obtained from previous step into a 3D vector with x, y, z coordinate.
 * set z as -1 for unit vector translations
 * @returns {function(*)}
 */
export const fromFilm2ToFilm3 = () => {
  const vectorFilm3 = new Vector3();

  return (vectorFilm2: Vector2) => {
    vectorFilm3
      .set(
        vectorFilm2.x,
        vectorFilm2.y,
        -1,
      );

    return vectorFilm3;
  };
};

/**
 * Convert vector 3 coordinates to camera matrix.
 * @param camera
 * @returns {function(*=)}
 */
export const fromFilm3ToCamera = (camera: PerspectiveCamera) => {
  const M = new Matrix3();
  const vectorCamera = new Vector3();

  return (vectorFilm3: Vector3) => {
    const f = camera.getFocalLength();
    M.set(
      1 / f, 0, 0,
      0, 1 / f, 0,
      0, 0, 1,
    );

    vectorCamera
      .copy(vectorFilm3)
      .applyMatrix3(M);

    return vectorCamera;
  };
};

/**
 * calculate eq (A)x^2 +/- (B)x +/- (C)
 * @param a
 * @param b
 * @param c
 */
const sqrtSolveP = (a: number, b: number, c: number) => (-b + sqrt(pow(b, 2) - 4 * a * c)) / (2 * a);
const sqrtSolveN = (a: number, b: number, c: number) => (-b - sqrt(pow(b, 2) - 4 * a * c)) / (2 * a);
const sqrtSolve = (a: number, b: number, c: number) => {
  let x;
  x = sqrtSolveP(a, b, c);

  if (abs(x) <= 0.4) {
    return x;
  }

  x = sqrtSolveN(a, b, c);

  if (abs(x) <= 0.4) {
    return x;
  }

  throw new Error('Assumption not respected!');
};

// https://math.stackexchange.com/questions/2385860/natural-panoramic-camera-controls
const getDeltaRotation = (camera: PerspectiveCamera, state: {width: number, height: number}) => {
  //convert pixel data to rotational matrix using vectors.
  const pixelsToCamera = flow([
    fromPixelsToFilm2(camera, state),
    fromFilm2ToFilm3(),
    fromFilm3ToCamera(camera),
  ]);

  const xf_camera = new Vector3();
  const xi_camera = new Vector3();
  const offset = new Euler();

  return (xi_pixels: Vector3, xf_pixels: Vector3) => {
    xi_camera
      .copy(pixelsToCamera(xi_pixels))
      .normalize();
    xf_camera
      .copy(pixelsToCamera(xf_pixels))
      .normalize();

    const x1 = xi_camera.x;
    const y1 = xi_camera.y;

    const x2 = xf_camera.x;
    const y2 = xf_camera.y;
    const z2 = xf_camera.z;

    let a;
    let b;
    let c;

    try {
      a = -y2 / 2;
      b = -z2;
      c = y2 - y1;
      const deltaPitch = sqrtSolve(a, b, c);

      a = -x2 / 2;
      b = deltaPitch * y2 + z2 * (1 - (pow(deltaPitch, 2)) / 2);
      c = x2 - x1;
      const deltaYaw = sqrtSolve(a, b, c);

      offset.set(
        deltaPitch,
        deltaYaw,
        0,
        'YXZ'
      );

      return offset;
    } catch (e) {
      return null;
    }
  };
};

const STATE = {
  NOT_MOVING: 0,
  PANNING: 1,
  FLOATING: 2,
};

const TWO_PI = 2 * PI;

// returns a angle value between 0 and 2*PI
function _normalizedPositiveAngle(angle: number) {
  const reducedAngle = angle % TWO_PI;

  // force it to be the positive remainder (so that 0 <= angle < TWO_PI)
  return (reducedAngle + TWO_PI) % TWO_PI;
}

class NaturalPanoramicControls {
  enabled: boolean;
  node: any;
  camera: PerspectiveCamera;
  state: number;
  viPixels: Vector2;
  vfPixels: Vector2;
  enableDamping: boolean;
  dampingFactor: number;
  latestTime: number;
  delta: Euler;
  t0: number;
  ti: number;
  tf: number;
  vt0: number;
  vp0: number;
  tracking: boolean;
  mouseDownTime: number;
  mouseUpTime: number;
  getDeltaRotation: any;

  constructor(camera: PerspectiveCamera, node: any) {
    this.enabled = true;
    this.node = node;
    this.camera = camera;

    // This line is very important! Our camera is set up with Y = up, -Z = at.
    // Maintaining the up vector between rotations means that the roll angle
    // is zero. YXZ means yaw about Y axis, pitch about X', roll about Z''.
    this.camera.rotation.reorder('YXZ');

    this.state = STATE.NOT_MOVING;
    this.viPixels = new Vector2(); // mouse position in pixels at previous frame
    this.vfPixels = new Vector2(); // mouse position in pixels currently

    this.enableDamping = true;
    this.dampingFactor = FRICTION;

    this.latestTime = 0; // time at last frame (so we can calculate dtheta / dt)
    this.delta = new Euler(); // YXZ ordered, y is yaw (aka theta), x is pitch (aka phi)

    // We hold these for momentum based pan.
    this.t0 = 0; // the time at which you started floating
    this.ti = 0; // the time at the previous frame
    this.tf = 0; // the time at the present frame
    this.vt0 = 0; // the theta velocity you had when you started floating
    this.vp0 = 0; // the phi velocity you had when you started floating

    this.tracking = false; // use this to stop movement tracking for small deltas
    this.mouseDownTime = 0;
    this.mouseUpTime = 0;
    this.getDeltaRotation = null;

    this.connect();
  }

  get width() {
    return this.node.clientWidth;
  }

  get height() {
    return this.node.clientHeight;
  }

  rotate(delta: Euler) {
    // don't rotate is camera's x rotation is already 90 +- 5
    if(this.camera.rotation.x + delta.x < PI / 2 && this.camera.rotation.x + delta.x > - PI / 2) {
      this.camera.rotation.x += delta.x;
    }
    this.camera.rotation.y += delta.y;
    /*
    //0 < phi < 180
    const phi = normalizedPositiveAngle(this.camera.rotation.x);
    const isConsideredUpsideDown = PI / 2 < phi && phi < 3 * PI / 2;

    if (isConsideredUpsideDown) {
      this.camera.rotation.y -= delta.y;
    } else {
      this.camera.rotation.y += delta.y;
    }
    this.camera.rotation.x += delta.x;*/
  }

  update() {
    if (!this.enabled) return;

    if (this.state === STATE.PANNING) {
      if (!this.viPixels && this.vfPixels) {
        this.viPixels = new Vector2().copy(this.vfPixels);
        return;
      }

      const delta = this.getDeltaRotation(
        this.viPixels,
        this.vfPixels,
      );

      if (delta) {
        this.rotate(delta);
        this.calculateAngularVelocity(delta.y, delta.x);
      }

      this.viPixels.copy(this.vfPixels);

    } else if (this.state === STATE.FLOATING) {
      //prevent floating for smaller delta of movement
      if(abs(this.mouseUpTime - this.mouseDownTime) > 100) {
        const delta = this.calculateMomentumBasedDelta();
        this.rotate(delta);
        if (abs(delta.y) <= 0.00001 && abs(delta.x) <= 0.00001) {
          this.state = STATE.NOT_MOVING;
        }
      }
    }
  }

  calculateAngularVelocity(dtheta: number, dphi: number) {
    const tf = Date.now();
    const dt = tf - this.latestTime;
    if (this.latestTime && dt !== 0) {
      if (dtheta !== 0) {
        this.vt0 = bounded(-MAX_ROTATIONAL_SPEED, dtheta / dt, MAX_ROTATIONAL_SPEED);
      }
      if (dphi !== 0) {
        this.vp0 = bounded(-MAX_ROTATIONAL_SPEED, dphi / dt, MAX_ROTATIONAL_SPEED);
      }
    }
    this.latestTime = tf;
  }

  calculateMomentumBasedDelta() {
    const t0 = this.t0;
    const ti = this.ti;
    const tf = Date.now();
    const vt0 = this.vt0 || 0;
    let uk = this.dampingFactor;
    uk = uk / 1.4;
    const vp0 = this.vp0 || 0;
    const tsign = vt0 >= 0 ? 1 : -1;
    const psign = vp0 >= 0 ? 1 : -1;
    this.delta.y = tsign * dxConstantFriction(t0, ti, tf, abs(vt0), uk);
    this.delta.x = psign * dxConstantFriction(t0, ti, tf, abs(vp0), uk);
    this.ti = tf;
    return this.delta;
  }

  resetRotation(x: number, y: number, _z: number) {
    this.camera.rotation.y = y;
    this.camera.rotation.x = x;
  }

  //inherited from MousePanControls from ovrui
  connect() {
    this.getDeltaRotation = getDeltaRotation(this.camera, {width: this.width, height: this.height});
    this.node.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.enabled = true;
  }

  disconnect() {
    this.node.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.enabled = false;
  }

  ifEnabled = (handler: (event: any) => void) => (event: any) => {
    if (this.enabled) handler(event);
  };

  startPan = (event: any, offsetX: number, offsetY: number) => {
    event.preventDefault();
    if(!this.tracking) {
      return;
    }
    this.state = STATE.PANNING;
    this.vfPixels = new Vector2(offsetX, offsetY);
  };

  moveRotate = (event: any, offsetX: number, offsetY: number) => {
    if (this.state !== STATE.PANNING) return;
    event.preventDefault();
    this.vfPixels.set(offsetX, offsetY);
  };

  stopPan = (event: any) => {
    event.preventDefault();
    this.state = this.enableDamping ? STATE.FLOATING : STATE.NOT_MOVING;
    // this.viPixels = null;
    // this.vfPixels = null;
    this.latestTime = 0;
    this.delta.x = 0;
    this.delta.y = 0;
    this.t0 = Date.now();
    this.ti = Date.now();
  };

  onMouseDown = this.ifEnabled((event) => {
    this.tracking = true;
    this.mouseDownTime = new Date().getTime();
    this.startPan(event, event.pageX, event.pageY);
  });

  onMouseMove = this.ifEnabled((event) => {
    if(!this.tracking) {
      return;
    }
    this.moveRotate(event, event.pageX, event.pageY);
  });

  onMouseUp = this.ifEnabled((event) => {
    this.tracking = false;
    this.mouseUpTime = new Date().getTime();
    this.stopPan(event);
  });
}

extend({ NaturalPanoramicControls });

export default function NaturalPanoramicCameraControls() {
  const { camera, gl: { domElement } } = useThree();
  const controls = useRef();

  useFrame(() => {
    //@ts-ignore
    controls.current.update();
  });

  // @ts-ignore
  return (<naturalPanoramicControls ref={controls} args={[camera, domElement]}/>);
}
