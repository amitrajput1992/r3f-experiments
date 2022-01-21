import React from "react";
import {Viewer} from "../src";
import PanoImageR from "../src/1-components/viewer/elements/definitions/3d/PanoImage/PanoImageR";
import TextR from "../src/1-components/viewer/elements/definitions/3d/Text";

// jsons
import pano from "./json/pano.json";
import text7 from "./json/text7.json";

export default {
  title: "Testers",
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      block: any;
    }
  }
}


let key = 0;
function makeChild(json: any) {
  switch(json.props.element_type) {
    case "pano_image": return <PanoImageR key={key++} json={json}/>;
    case "text": return <TextR key={key++} json={json}/>;
  }
}

const TextTesterB = () => {
  const children = [
    makeChild(pano),
    makeChild(text7),
  ];
  return (
    <Viewer children={children}/>
  );
}

export const TextTester = TextTesterB.bind({});