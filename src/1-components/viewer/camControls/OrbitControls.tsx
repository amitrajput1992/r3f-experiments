import React, { useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls as oc } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls: oc });

export default function OrbitControls() {
  const { camera, gl: { domElement } } = useThree();
  const control = useRef();
  //@ts-ignore
  useFrame(() => control.current.update());

  return (
    <orbitControls ref={control} args={[camera, domElement]} />
  );
}
