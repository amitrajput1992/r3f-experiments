import React, { useState } from "react";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";
import Transition from "./Transition";
import { Html } from "@react-three/drei";

enum States {
  transition = "transition",
  scene = "scene"
}

const Exp = () => {
  const [renderState, setRenderState] = useState(States.scene);
  const [sceneNum, setSceneNum] = useState(1);

  function afterTransition() {
    setSceneNum(sceneNum === 1? 2: 1);
    setRenderState(States.scene);
  }

  function transition() {
    setRenderState(States.transition);
  }

  const sceneToRender = sceneNum === 1 ? <Scene1 /> : <Scene2 />;

  const child1 = sceneNum === 1? <Scene1 />: <Scene2 />;
  const child2 = sceneNum === 1? <Scene2 />: <Scene1 />;

  return (
    <>
      <Html>
        <button style={{position: "absolute", top: 0, left: 0}} onClick={transition}>TRANSITION</button>
      </Html>
      {
        renderState === States.scene?
          sceneToRender:
          <Transition afterTransitionCb={afterTransition}  child1={child1} child2={child2} />
      }
    </>
  );
};

export default Exp;