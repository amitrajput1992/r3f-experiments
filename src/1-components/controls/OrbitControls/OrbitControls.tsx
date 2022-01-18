import React, { useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {OrbitControlsImpl} from "./OrbitControlsImpl";
import {Vector3} from "three";
import { useEffect } from "react";

export type Props = {
  target?: Vector3
  enableDamping?: boolean,
  render?: boolean
}

const OrbitControls = ({enableDamping = true, target, render = true}: Props) => {
  const {camera, gl} = useThree(({camera, gl}) => ({camera, gl}));
  const controls = useMemo(() => new OrbitControlsImpl(camera), []);

  useFrame(() => {
    controls.update();
  });

  useEffect(() => {
    controls.enabled = render;
  }, [render]);

  useEffect(() => {
    if(target) {
      applyNewTarget(target);
    }
  }, [target])

  function applyNewTarget(target: Vector3) {
    controls.target = target;
    controls.enableDamping = enableDamping;
    const targetDistanceFromCamera = camera.position.distanceTo(target);
    controls.maxDistance = targetDistanceFromCamera * 5;
  }

  useEffect(() => {
    applyNewTarget(target || new Vector3(0, 0, -8));
    controls.connect(gl.domElement);
    return () => {
      controls.reset();
      controls.dispose();
    };
  }, []);

  return null;
};

export default OrbitControls;