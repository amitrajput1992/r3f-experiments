import React, { useMemo, useRef, useState, useLayoutEffect, RefObject } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import {
  LinearEncoding,
  LinearFilter, OrthographicCamera, PerspectiveCamera,
  RGBAFormat,
  Scene, ShaderMaterial,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { fragmentShader, vertexShader } from "./shaders/CrossFade";
import { useFBO } from "@react-three/drei";
import { useSpring } from "@react-spring/three";

const shaderArgs = (() => {
  const loader = new TextureLoader();
  const mixT = loader.load("https://s.vrgmetri.com/gb-web/r3f-ui/assets/transitions/transition1.png");
  return {
    uniforms: {
      tDiffuse1: {
        value: null,
      },
      tDiffuse2: {
        value: null,
      },
      mixRatio: {
        value: 0.0,
      },
      threshold: {
        value: 0.2,
      },
      useTexture: {
        value: 0,
      },
      tMixTexture: {
        value: mixT,
      },
    },
    vertexShader,
    fragmentShader,
  };
})();

const renderTargetParameters = {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat,
  encoding: LinearEncoding,
  generateMipmaps: false,
};

interface TransitionProps {
  child1: React.ReactElement,
  child2: React.ReactElement,
  afterTransitionCb: () => void,
}

const springConf = { duration: 3000 };
/**
 * Portal both children to 2 separate in memory scenes.
 * During transition
 *  1. render both scenes to their resp FBOs using the default camera setup.
 *  2. blend the textures from child1 and child2 and render onto a plane with an ortho camera setup. Ortho camera projection remains same no matter where the object is placed in front of it.
 *
 * use a different camera setup to render scene2. This is required so that we can have separate camera setups per scene and control scene orientations
 */
export const TransitionFC = ({ child1, child2, afterTransitionCb }: TransitionProps) => {
  const transitionScene = useResource<Scene>();
  const transitionOrthoCamera = useResource<OrthographicCamera>();
  const scene1 = useMemo(() => new Scene(), []);
  const scene2 = useMemo(() => new Scene(), []);

  const childrenReadyForRender = useRef({ child2: false });
  const updateCameraRotation = useRef(true);
  const { size, gl, camera } = useThree(state => ({ size: state.size, gl: state.gl, camera: state.camera }));

  // ! Using a different camera for scene2 to accommodate for camera rotations.
  // ! copy all the properties from the default camera and apply any necessary rotations
  const camera1 = useMemo(() => {
    const c = camera.clone() as PerspectiveCamera;
    //* update the camera projection matrix after all updates so the perspective matches with that of the default camera
    c.updateProjectionMatrix();
    c.updateMatrix();
    return c;
  }, []);

  const camera2 = useMemo(() => {
    const c1 = camera.clone() as PerspectiveCamera;
    //* update the camera projection matrix after all updates so the perspective matches with that of the default camera
    c1.updateProjectionMatrix();
    c1.updateMatrix();
    return c1;
  }, []);


  const fboScene1 = useFBO(size.width, size.height, renderTargetParameters);
  const fboScene2 = useFBO(size.width, size.height, renderTargetParameters);
  const mat = useRef(new ShaderMaterial());

  function springChange({ value: { x } }: { value: { x: number } }) {
    if (!transitionScene.current || !transitionOrthoCamera.current) {
      return;
    }
    mat.current && (mat.current.uniforms.mixRatio.value = x);
    renderScene2(gl, true);
    renderScene1(gl, true);
    gl.setRenderTarget(null);
    gl.clear();
    gl.render(transitionScene.current, transitionOrthoCamera.current);
  }

  function springComplete() {
    console.log("transition completed in transition 3");
    afterTransitionCb?.();
  }

  const [_, animate] = useSpring(() => ({
    from: { x: 1 },
    config: springConf,
    onChange: springChange,
    onRest: springComplete,
  }), []);

  /**
   * Render both scenes to a FBO (frame buffer object, imagine it being an imaginary canvas)
   * @param gl
   * @param rtt - render to texture
   */
  function renderScene1(gl: WebGLRenderer, rtt: boolean) {
    if (!scene1) {
      return;
    }
    if (rtt) {
      gl.setRenderTarget(fboScene1);
      gl.clear();
      gl.render(scene1, camera1);
    } else {
      gl.setRenderTarget(null);
      gl.render(scene1, camera1);
    }
  }

  function renderScene2(gl: WebGLRenderer, rtt: boolean) {
    if (!scene2) {
      return;
    }
    if (rtt) {
      gl.setRenderTarget(fboScene2);
      gl.clear();
      gl.render(scene2, camera2);
    } else {
      gl.setRenderTarget(null);
      gl.render(scene2, camera2);
    }
  }

  /**
   * 2nd argument to useFrame is render priority. A render priority value > 0 means that we are taking over the default render loop from default webgl renderer,
   * and the we are responsible for rendering the scene.
   * This is used here since we are rendering and blending 2 inmemory scenes onto a transition scene. (threejs scenes)
   *
   * Transitions happen on demand when child2 is ready after render. The transition animation is handled by a spring.
   * Here useFrame with a renderPriority = 1 is added as a placeholder so we can take over the render loop.
   *
   * Also need to make sure that the camera rotations continue to work while the 2nd scene is being prepped.
   * Once the 2nd scene is ready, stop this update and let the transition continue.
   */
  useFrame(({ gl }) => {
    if (!transitionScene.current || !transitionOrthoCamera.current) {
      return;
    }

    /**
     * Since the camera controls work only on the default camera, we copy the rotation and position here to accommodate for any orientation changes while transitions
     */
    if (updateCameraRotation.current) {
      camera1.rotation.copy(camera.rotation);
      camera1.position.copy(camera.position);
      camera1.updateMatrix();
      renderScene1(gl, false);
    }

  }, 1);

  function child2ReadyToRender() {
    console.log("CHILD2 READY FOR RENDER");
    updateCameraRotation.current = false;
    childrenReadyForRender.current.child2 = true;
    isReadyForTransition();
  }

  /**
   * We always know that child 1 will be ready to render, since this is scene being transitioned out of.
   */
  function isReadyForTransition() {
    if (childrenReadyForRender.current.child2) {
      console.log("starting transition in transition 3");
      animate.start({ to: { x: 0 } });
    }
  }

  function child1Ready() {
    console.log("CHILD1");
  }

  function child2Ready() {
    console.log("CHILD2");
    child2ReadyToRender();
  }

  return (
    <>
      <scene ref={transitionScene}>
        <orthographicCamera ref={transitionOrthoCamera}
                            args={[size.width / -2, size.width / 2, size.height / 2, size.height / -2, -1]} />
        <mesh>
          <planeGeometry attach="geometry" args={[size.width, size.height]} />
          <shaderMaterial
            ref={mat}
            attach={"material"}
            args={[shaderArgs]}
            uniforms-tDiffuse1-value={fboScene1.texture}
            uniforms-tDiffuse2-value={fboScene2.texture}
            transparent={true}
          />
        </mesh>
      </scene>
      {
        createPortal(<child1.type onReady={child1Ready} />, scene1)
      }
      {
        createPortal(<child2.type onReady={child2Ready} />, scene2)
      }
    </>
  );
};

export default React.memo(TransitionFC);

export function useResource<T>(optionalRef?: React.MutableRefObject<T>): React.MutableRefObject<T> {
  const [_, forceUpdate] = useState(false);
  const localRef = useRef<T>((undefined as unknown) as T);
  const ref = optionalRef ? optionalRef : localRef;
  useLayoutEffect(() => void forceUpdate((i) => !i), []);
  return ref;
}