import React from "react";
import { Element3DHelper } from "../../../helpers/Element3DHelper";
import { rtp, r } from "@gmetrixr/rjson";
import LegacyText from "./Legacy";
import Text from "./TextR";

const TextRFC = ({ json }: any) => {
  const elementF = r.element(json);
  const version = elementF.getValueOrDefault(rtp.element.text_version) as string;

  return (
    <Element3DHelper json={json}>
      {
        version === "v2"?
          <Text json={json} />:
          <LegacyText json={json} />
      }
    </Element3DHelper>
  );
};

export default React.memo(TextRFC);
