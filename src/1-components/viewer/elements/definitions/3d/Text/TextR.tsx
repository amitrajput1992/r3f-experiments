import React, { useRef } from "react";
import { Mesh, Color, Vector3 } from "three";
import Frame from "../../../../../blocks/components/Frame";
import { rtp, r, en } from "@gmetrixr/rjson";
import { Text as TT } from "@react-three/drei";
import { getClosestFontPath } from "../../../helpers/FontList";
import { useThree } from "@react-three/fiber";

type TextAlign = "left" | "right" | "center" | "justify" | undefined;
type AnchorX = number | "left" | "right" | "center" | undefined;
type AnchorY = number | "top" | "top-baseline" | "middle" | "bottom-baseline" | "bottom" | undefined;

// https://codesandbox.io/embed/troika-3d-text-via-react-three-fiber-ntfx2?fontsize=14
const Text = ({ json }: any) => {
  const camera = useThree(s => s.camera);
  const elementF = r.element(json);
  const text = elementF.getValueOrDefault(rtp.element.text) as string;
  const wh = elementF.getValueOrDefault(rtp.element.wh) as number[];
  const width = wh[0];
  const height = wh[1];
  const fontSizeRaw = elementF.getValueOrDefault(rtp.element.font_size) as number;
  const opacity = elementF.getValueOrDefault(rtp.element.opacity) as number;
  const fontColor = elementF.getValueOrDefault(rtp.element.font_color) as string;
  const elementType = elementF.get(rtp.element.element_type) as en.ElementType;

  /**
   * default fontFamily = Montserrat, fontWeight = 400
   * the clash between fontWeight and bold properties is handled in an `r` migration.
   */
  const fontFamily = elementF.getValueOrDefault(rtp.element.font_family) as any;
  const fontWeight = elementF.getValueOrDefault(rtp.element.font_weight) as number;
  const font = getClosestFontPath({ face: fontFamily, weight: fontWeight });

  // Background Properties
  const borderRadius = elementF.getValueOrDefault(rtp.element.border_radius) as number;
  const backgroundColor = elementF.getValueOrDefault(rtp.element.background_color) as number;
  const backgroundOpacity = elementF.getValueOrDefault(rtp.element.background_opacity) as number;
  const padding = elementF.getValueOrDefault(rtp.element.padding) as number;
  const verticalAlignment = elementF.getValueOrDefault(rtp.element.vertical_alignment) as AnchorY;
  const horizontalAlignment = elementF.getValueOrDefault(rtp.element.horizontal_alignment) as AnchorX;

  const fontSize = fontSizeRaw * 0.8;


  const letterSpacing = -0.035;
  const lineHeight = 1.35;
  const textAlign: TextAlign = "justify";

  const textToRender = text;

  /**
   * Adjust the position of the mesh inside the container based on padding (for height) + text mesh's size
   * @param troikaMesh
   */
  function onTextMeshSync(troikaMesh: Mesh) {
    const containerHeight = height - (2 * padding);
    const containerWidth = width - (2 * padding);

    const v = new Vector3();
    troikaMesh.geometry.computeBoundingBox();
    troikaMesh.geometry.boundingBox?.getSize(v);

    const textHeight = v.y;
    const textWidth = v.x;

    // adjust vertical alignment
    // vertical alignment is only possible when text height < container height
    if(textHeight < containerHeight) {
      switch(verticalAlignment) {
        case "top": {
          troikaMesh.position.y = (containerHeight / 2) - (textHeight / 2);
          // troikaMesh.position.y = containerHeight / 2 + topLineHeightAdjustment;
          break;
        }
        case "middle": {
          // ! NO-OP
          break;
        }
        case "bottom": {
          troikaMesh.position.y = (- containerHeight / 2) + (textHeight / 2);
          break;
        }
      }
    }

    // horizontal alignment is only possible when text width < container width
    if(textWidth < containerWidth) {
      switch (horizontalAlignment) {
        case "left": {
          troikaMesh.position.x =  (-containerWidth / 2) + (textWidth / 2);
          break;
        }
        case "center": {
          // ! NO-OP
          break;
        }
        case "right": {
          troikaMesh.position.x = (containerWidth / 2) - (textWidth / 2);
          break;
        }
      }
    }
  }

  const ref = useRef<any>();

  const textWidth = width - (2 * padding);

  return (
    <Frame
      ref={ref}
      width={width}
      height={height}
      borderRadius={borderRadius}
      backgroundColor={new Color(backgroundColor)}
      backgroundOpacity={backgroundOpacity}
    >
      <group position={[0, 0, 0.001]}>
        {/* padding frame, for debugging only */}
        {/*<Frame
          width={width - (2 * padding)}
          height={height - (2 * padding)}
        />*/}
        <TT
          depthOffset={-0.1}
          userData={{ needsRenderOrder: true }}
          fillOpacity={opacity}
          color={fontColor}
          fontSize={fontSize}
          maxWidth={textWidth}
          letterSpacing={letterSpacing}
          lineHeight={lineHeight}
          textAlign={textAlign}
          font={font}
          anchorX={"center"}
          anchorY={"middle"}
          // anchorX={horizontalAlignment}
          // anchorY={verticalAlignment}
          onSync={onTextMeshSync}
          visible={opacity > 0}
        >
          {textToRender}
        </TT>
      </group>
    </Frame>
  );
};

export default Text;
