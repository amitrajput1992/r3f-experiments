import React, { useEffect, useMemo } from "react";
import { BoxHelper as ThreeBoxhelper } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Object3D } from "three";

export const BoxHelper = ({obj}: {obj: Object3D | Group}) =>{
  const scene = useThree(s => s.scene);
  const boxHelper = useMemo(() => new ThreeBoxhelper(obj), [obj]);
  boxHelper.name = "BoxHelper";
  useEffect(() => {
    scene.add(boxHelper);

    return () => {
      scene.remove(boxHelper);
    };
  }, [obj, scene]);

  useFrame(() => {
    if(obj && boxHelper) {
      boxHelper.setFromObject(obj);
      boxHelper.update();
    }
  });

  return null;
};