import { DoubleSide } from "three";
import React from "react";

interface PlaneDirectProps {
  width?: number,
  height?: number,
  color?: string,
  opacity?: number,
  wireframe?: boolean,
}

export const PlaneDirect = ({ width = 1, height = 1, color = "#FFF", opacity = 1, wireframe = false }: PlaneDirectProps) => {
  return (
    <mesh renderOrder={999}>
      {/* args = [width, height, widthSegments, heightSegments] */}
      <planeBufferGeometry args={[width, height, 1]}/>
      <meshBasicMaterial
        wireframe={wireframe}
        attach="material"
        side={DoubleSide}
        opacity={opacity}
        transparent={true}
        color={color}
      />
    </mesh>
  )
};