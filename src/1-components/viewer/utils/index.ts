import { AddEquation, Euler, Matrix4, NormalBlending, Vector3 } from "three";
import {clamp} from "ramda";

export const computeEffectiveOpacity = (opacity: number) => {
  opacity = clamp(0, 1, opacity);
  if (opacity === 0) {
    return 0.01;
  }
  return opacity;
};

/**
 * certain meshes need opacity = 0.99 to be considered transparent.
 * since transparent objects are the only ones sorted by default by three, we need to make sure we are letting the renderer know what
 * meshes are transparent.
 *
 * clamp the opacity between 0.01 and 0.99.
 * @param opacity
 */
export const computeEffectiveOpacityForPano = (opacity: number) => {
  opacity = clamp(0, 1, opacity);
  if(opacity === 0) {
    return 0.01;
  } else if(opacity === 1) {
    return 0.99;
  }
  return opacity;
};

export const defaultMaterialParams = {
  depthWrite: true,
  depthTest: true,
  colorWrite: true,
  blending: NormalBlending,
  blendEquation: AddEquation,
  premultipliedAlpha: true,
};

export function computeRotationVectorFromPlacer(placer: number[]): number[] {
  const matrix = new Matrix4();
  // look at the camera from the object (shortcut for inverse camera projection)
  matrix.lookAt(
    new Vector3(0, 0, 0),
    new Vector3(placer[0], placer[1], placer[2]),
    new Vector3(0, 1, 0),
  );
  const e = new Euler().setFromRotationMatrix(matrix, "YXZ");
  return [e.x, e.y, e.z];
}

const url = new URL(window.location.href);
export const devMode = url.searchParams.get("__DEV__") === "true";
export const log = devMode ? console.log: () => {};
