import React, { useState } from "react";
import { useLoader } from "@react-three/fiber"; // to use custom ts jsx components
import { TextureLoader, Vector3, MathUtils, DoubleSide, ClampToEdgeWrapping, LinearFilter } from "three";
import { computeEffectiveOpacityForPano } from "../../../../utils";

// this is used to orient the center of the camera to the center of the pano
const DEFAULT_PANO_Y = -90;
const scaleInvertForCenterCamera = new Vector3(-1, 1, 1);

const PanoImageRFC = ({ json }: any) => {
  const source = json.props.source;
  const sourceUrl = source?.file_urls?.o;
  const rotationOffset = 0
  const radius = json.props.pano_radius;
  const opacity = computeEffectiveOpacityForPano(json.props.opacity);
  const hiddenInJson = json.props.hidden;
  const [hidden, setHidden] = useState(hiddenInJson);

  //On Progress: https://github.com/mrdoob/three.js/blob/afccc97c23e1619879dccea9a9917ad627e2b19f/src/loaders/FileLoader.js#L219
  //Returned event: https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
  //Fourth argument onProgress doesn't work
  const texture = useLoader(TextureLoader, sourceUrl) as any;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;


  return (
    <mesh userData={{needsRenderOrder: true, renderDistance: radius}} scale={scaleInvertForCenterCamera} rotation={[0, MathUtils.degToRad(DEFAULT_PANO_Y + rotationOffset), 0]} name={"PanoImageR__mesh"}>
      <sphereBufferGeometry attach="geometry" args={[radius, 60, 40]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={DoubleSide}
        opacity={opacity}
        transparent={opacity < 1}
      />
    </mesh>
  );
};

export default React.memo(PanoImageRFC);
