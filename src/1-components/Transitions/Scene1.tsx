import React, { Suspense } from "react";
import Pano from "../viewer/elements/definitions/3d/PanoImage/PanoImageR";
import PanoJson from "../../../stories/json/pano1.json";

const Scene1 = ({onReady}: {onReady?: () => void}) => {
  return (
    <group>
      <Suspense fallback={null}>
        <ambientLight intensity={2}/>
        <Pano json={PanoJson} onReady={onReady} />
      </Suspense>
    </group>
  );
};

export default Scene1;