import React from "react";
import TeleportationC from "../src/1-components/teleporting";

export default {
  title: "Teleportation",
  argTypes: {
    color: {
      defaultValue: "#FF0000",
      control: { type: "color" }
    },
    radius: {
      defaultValue: 1,
      control: { type: "range", min: 0.1, max: 2, step: 0.1 }
    },
    opacity: {
      defaultValue: 1,
      control: { type: "range", min: 0.1, max: 1, step: 0.01 }
    },
    height: {
      defaultValue: 0.5,
      control: { type: "range", min: 0.1, max: 2, step: 0.1 }
    }
  }
};

export const Teleportation = (args: any) => {
  const zoneProps = {
    color: args.color,
    radius: args.radius,
    opacity: args.opacity,
    height: args.height,
  };
  return (
    <TeleportationC zone={zoneProps} />
  );
}