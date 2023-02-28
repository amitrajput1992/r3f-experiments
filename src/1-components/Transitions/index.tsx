import React from "react";
import Div100vh from "react-div-100vh";
import { CanvasContainer } from "../teleporting/styles";
import { Canvas } from "@react-three/fiber";
import { RenderOrder } from "../viewer/canvas/RenderOrder";
import MousePanCameraControls from "../viewer/camControls/MousePanControls";
import Exp from "./Exp";

const Transitions = () => {

  return (
    <Div100vh>
      <CanvasContainer>
        <Canvas
          camera={{
            fov: 75,
            near: 0.01,
            far: 1500,
            position: [0, 0, 0],
            zoom: 1,
          }}
          dpr={window.devicePixelRatio}
          //toggle sRGB color management.
          linear={false}
          flat={true}
        >
          <RenderOrder />
          <MousePanCameraControls />
          {/*<OrbitControls />*/}
          <Exp />
        </Canvas>
      </CanvasContainer>
    </Div100vh>
  );
};

export default Transitions;