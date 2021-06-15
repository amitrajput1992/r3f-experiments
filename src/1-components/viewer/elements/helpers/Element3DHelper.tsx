import React, { useRef, useState } from "react";
import { Euler, Group, MathUtils, Vector3 } from "three";
import { Interactive, useXR } from "@react-three/xr";
import { BoxHelper } from "./BoxHelper/BoxHelper";
import { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";

const { degToRad } = MathUtils;

export interface ElementRProps {
  json: any,
  children: any
}

/**
 * ElementHelper Functional Component
 */
const Element3DHelperFC = ({json, children, debug}: ElementRProps & {debug?: boolean}): JSX.Element => {
  const {isPresenting} = useXR();

  const hiddenInJson = json.props.hidden;
  const [hidden, setHidden] = useState(hiddenInJson);
  const [hovered, setHovered] = useState(false);
  const debugRef = useRef<Group>(new Group());


  const wh = json.props.wh;
  const whd = json.props.whd;

  const scaleCommon = json.props.scale;
  const placer3d = json.props.placer_3d;

  const positionVector3 = new Vector3(placer3d[0] ?? 0, placer3d[1] ?? 0, placer3d[2] ?? 0);
  const rotation: Euler = new Euler(degToRad(placer3d[3] ?? 0), degToRad(placer3d[4] ?? 0), degToRad(placer3d[5] ?? 0), "YXZ");
  // object 3d scale is applied at the element level
  const scale = new Vector3().fromArray([(placer3d[6] ?? 1) * scaleCommon,
    (placer3d[7] ?? 1) * scaleCommon,
    (placer3d[8] ?? 1) * (whd === undefined ? 1 : scaleCommon)]
  );

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    // Only the mesh closest to the camera will be processed
    event.stopPropagation()
  }

  function onSelectInXR() {}

  if (hidden === false) {
    const children$$ = (
        <group scale={scale} ref={debugRef}>
          {
            children
          }
        </group>
    );

    const objectWithAnimation = (
      <group
        name={"Element3DHelper__placer"}
        position={positionVector3}
        rotation={rotation}
        onClick={onClick}
      >
        {
          children$$
        }
      </group>
    );

    if(isPresenting) {
      return (
        <Interactive onSelect={onSelectInXR} >
          <group
            position={positionVector3}
            rotation={rotation}
            // these are not required when running in XR mode
            // onClick={onClick}
            // onPointerUp={onPointerUp}
            // onPointerDown={onPointerDown}
          >
            {objectWithAnimation}
          </group>
        </Interactive>
      );
    }

    return (
      <>
        {
          debug? <BoxHelper obj={debugRef.current}/>: null
        }
        {
          objectWithAnimation
        }
      </>
    )
  } else {
    return <React.Fragment />
  }
}

/**
 * Helps with:
 * placement of the component
 * basic cog functionality like:
 * actions hide/show
 * events onClick 
 */
//export const Element3DHelper = React.memo(Element3DHelperFC);
export const Element3DHelper = Element3DHelperFC;
