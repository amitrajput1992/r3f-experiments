import React from "react";
/**
 * If a scene has no light elements, add our default set of lights.
 * @constructor
 */
const DefaultLights = () => {
    return (
    <>
      <ambientLight color={"white"} intensity={0.7} />
      <pointLight color={"white"} position={[0, 0, 0]} intensity={0.7} />
    </>
  );
};

export default React.memo(DefaultLights);