import React, { useState } from "react";
import { Element3DHelper } from "../../../helpers/Element3DHelper";
import { Text } from "@react-three/drei";
import { Mesh } from "three";
import {getClosestFontPath} from "../../../helpers/FontList";

const TextRFC = ({ json }: any) => {
  const text = json.props.text;
  const wh = json.props.wh;
  const width = wh[0];

  const opacity = json.props.opacity;
  const fontColor = json.props.font_color;
  const fontSize = json.props.font_size;

  /**
   * default fontFamily = Montserrat, fontWeight = 400
   * the clash between fontWeight and bold properties is handled in an `r` migration.
   */
  const fontFamily = json.props.font_family;
  const fontWeight = json.props.font_weight;
  const font = getClosestFontPath({ face: fontFamily, weight: fontWeight });

  const letterSpacing = -0.035;
  const lineHeight = 1.35;
  const textAlign = "left";

  const anchorX: number | "left" | "right" | "center" | undefined = "center";
  const anchorY: number | "top" | "top-baseline" | "middle" | "bottom-baseline" | "bottom" | undefined = "top";
  const [templatedText, setTemplatedText] = useState(text);

  /**
   * As soon as Troika Text Mesh is ready, adjust it's position
   * compute the size of the Text Mesh.
   * Since the Text Mesh's top is placed at the center of the invisible plane, we just need to align the top of Text Mesh with the top of the plane.
   * to do that, set relative y position = height / 2
   * @param troikaMesh
   */
  function onTextMeshSync(troikaMesh: Mesh) {
    troikaMesh.position.y = wh[1] / 2;
  }

  return (
    <Element3DHelper json={json}>
      <Text
        userData={{ needsRenderOrder: true }}
        fillOpacity={opacity}
        color={fontColor}
        fontSize={fontSize * 0.8}
        maxWidth={width}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
        textAlign={textAlign}
        font={font}
        anchorX={anchorX}
        anchorY={anchorY}
        onSync={onTextMeshSync}
        visible={opacity > 0}
      >
        {/* below is a very bad hack to match the outcome to what we got in r360. r360 uses \t for spaces. */}
        {templatedText.replace(/ /g, "\t")}
      </Text>
    </Element3DHelper>
  );
};

export default React.memo(TextRFC);
