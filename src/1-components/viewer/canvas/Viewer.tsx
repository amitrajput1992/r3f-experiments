import React, { useRef } from "react";
import { CanvasRoot3d } from "./CanvasRoot3d";

require("./canvasRoot.scss");

export interface CanvasRootProps {
  children?: React.ReactNode,
}

const ViewerFC = ({children}: CanvasRootProps) => {
  const canvasRoot = useRef(document.createElement("div"));
  const canvas3dRoot = useRef(document.createElement("canvas"));

  return (
    <div className="view-root" ref={canvasRoot}>
      
      {/* z-index: 0 BottomMost 3D Canvas Layer*/}
      <div className="view-3d-root">
        <CanvasRoot3d
          canvas3dRef={canvas3dRoot}
          view3dChildren={children}
        />
      </div>
    </div>
  );
}

export const Viewer = React.memo(ViewerFC);