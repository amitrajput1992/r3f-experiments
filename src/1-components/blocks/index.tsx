import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import Div100vh from "react-div-100vh";
import Frame from "./components/Frame";
import { Color, Vector3 } from "three";
import {useSpring, config} from "@react-spring/three";
import OrbitControls from "../controls/OrbitControls/OrbitControls";

const Blocks = () => {

  useSpring({
    from: { x: 0 },
    to: async (next) => {
      await next({ x: 0.5 })
      await next({ x: 0 })
    },
    config: {
      duration: 1000
    },
    loop: true,
    onChange: (v) => {
      if(typeof v === "number") {
        if(animatedFrame.current) {
          animatedFrame.current.material.uniforms.u_borderWidth.value = v;
          animatedFrame.current.material.needsUpdate = true;
        }
      }
    }
  });

  useSpring({
    from: { x: 0 },
    to: async (next) => {
      await next({ x: 0.5 })
      await next({ x: 0 })
    },
    config: {
      duration: 1000
    },
    loop: true,
    onChange: (v) => {
      if(typeof v === "number") {
        if(animatedFrame.current) {
          animatedFrame.current.material.uniforms.u_borderRadiusTopLeft.value = v;
          animatedFrame.current.material.uniforms.u_borderRadiusTopRight.value = v;
          animatedFrame.current.material.uniforms.u_borderRadiusBottomRight.value = v;
          animatedFrame.current.material.uniforms.u_borderRadiusBottomLeft.value = v;
          animatedFrame.current.material.needsUpdate = true;
        }
      }
    }
  });

  const animatedFrame = useRef<any>();

  return (
    <Div100vh>
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
        linear={true}
      >
        <OrbitControls />
        <group position={[0, 2.2, -8]}>
          <Frame
            width={6.5}
            height={4}
            // backgroundColor={new Color("green")}
            backgroundOpacity={0.6}
            borderRadius={0.5}
            borderWidth={0.1}
            borderColor={new Color("green")}
          />
        </group>
        <group position={[0, -2.2, -8]}>
          <Frame
            ref={animatedFrame}
            width={6.5}
            height={4}
            // backgroundColor={new Color("green")}
            backgroundOpacity={0.6}
            borderRadius={0.5}
            borderWidth={0.1}
            borderColor={new Color("green")}
          />
        </group>
      </Canvas>
    </Div100vh>
  );
};

export default Blocks;