import { Canvas } from "@react-three/fiber";
import React from "react";
import Div100vh from "react-div-100vh";
import OrbitControls from "../controls/OrbitControls/OrbitControls";
import { CanvasContainer } from "./styles";
import Pano from "../viewer/elements/definitions/3d/PanoImage/PanoImageR";
import PanoJson from "../../../stories/json/pano.json";
import { RenderOrder } from "../viewer/canvas/RenderOrder";
import Zone from "./components/Zone";

type Props = {
  zone?: {
    color?: string,
    radius?: number,
    opacity?: number,
    height?: number
  }
};

const Teleporting = (props: Props) => {
  const zoneProps = props.zone;
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

        >
          <RenderOrder />
          {/*<MousePanCameraControls />*/}
          <OrbitControls />
          <ambientLight intensity={2}/>
          <React.Suspense fallback={null}>
            <Pano json={PanoJson}/>
            <group position={[0, 0, -3]}>
              <Zone {...zoneProps} />
            </group>
          </React.Suspense>
        </Canvas>
      </CanvasContainer>
    </Div100vh>
  );
};

export default Teleporting;