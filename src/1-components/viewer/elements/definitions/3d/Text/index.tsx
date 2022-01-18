import React from "react";
import { Element3DHelper } from "../../../helpers/Element3DHelper";
import { rtp, r } from "@gmetrixr/rjson";
import LegacyText from "./Legacy";
import Text from "./TextR";

const TextRFC = ({ json }: any) => {
  const elementF = r.element(json);
  const showBackground = elementF.getValueOrDefault(rtp.element.show_background) as boolean;

  return (
    <Element3DHelper json={json}>
      {
        showBackground?
          <Text json={json} />:
          <LegacyText json={json} />
      }
    </Element3DHelper>
  );
};

export default React.memo(TextRFC);
