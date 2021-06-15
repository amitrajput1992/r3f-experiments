import React from "react";
import {Viewer} from "../src";
import PanoImageR from "../src/1-components/viewer/elements/definitions/3d/PanoImage/PanoImageR";
import TextR from "../src/1-components/viewer/elements/definitions/3d/Text/TextR";

// jsons
import pano from "./json/pano.json";
import text1 from "./json/text1.json";
import text2 from "./json/text2.json";
import text3 from "./json/text3.json";
import text4 from "./json/text4.json";
import text5 from "./json/text5.json";
import text6 from "./json/text6.json";

export default {
  title: "Testers",
};

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
    makeChild(text1),
    makeChild(text2),
    makeChild(text3),
    makeChild(text4),
    makeChild(text5),
    makeChild(text6),
  ];
  return (
    <Viewer children={children}/>
  );
}

export const TextTester = TextTesterB.bind({});