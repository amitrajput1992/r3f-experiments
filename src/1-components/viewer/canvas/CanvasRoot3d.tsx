import React, { MutableRefObject, Suspense } from "react";
import { XR, Controllers } from "@react-three/xr";
import { RenderOrder } from "./RenderOrder";
import { ResizeObserver } from "@juggle/resize-observer";
import DefaultLights from "./DefaultLights";
import MousePanCameraControls from "../camControls/MousePanControls";
import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface CanvasRoot3dFCProps {
  canvas3dRef: MutableRefObject<HTMLCanvasElement>,
  view3dChildren?: React.ReactNode,
}

/**
 * Canvas with Camera at the center (SphericalControl)
 * The root component of for rendering 3D canvases.
 * May contain the camera, lights and all the basic things
 * needed to start rendering 3D objects
 */
const CanvasRoot3dFC = (props: CanvasRoot3dFCProps): JSX.Element => {
  return (
    <Suspense fallback={null}>
      <Canvas
        resize={{ polyfill: ResizeObserver }}
        // overriding onCreated here so that the default vr/ar buttons are not added.
        // https://github.com/pmndrs/react-xr/blob/f3b96d520f8cbe4c19f3670f7b351bfeb8e6ac14/src/XR.tsx#L131
        onCreated={() => {
        }}
        // color="#000000" //default black background for canvas
        // with r3f v6, ability to add camera via a setter has been removed, the camera can be added initially or
        // pass the props that will get applied to the default camera setup. In our case, this works best as it avoid un-necessary re-renders on camera change.
        camera={{
          fov: 75,
          near: 0.01,
          far: 1500,
          position: [0, 0, 0],
          zoom: 1,
        }}
        //
        dpr={window.devicePixelRatio}
        //toggle sRGB color management.
        linear={true}
      >
        <XR>
          <MousePanCameraControls />
          <DefaultLights />
          <Controllers />
          <RenderOrder />
          {
            props.view3dChildren
          }
        </XR>
        <Stats />
      </Canvas>
    </Suspense>
  );
};

export const CanvasRoot3d = React.memo(CanvasRoot3dFC);
