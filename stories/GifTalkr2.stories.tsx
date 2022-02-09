import React from "react";
import GifTalkrC from "../src/1-components/gif-talkr";

export default {
  title: "Gif Talkr 2",
};

const GifTalkrB = () => {
  return (
    <GifTalkrC gifURL={"https://s.vrgmetri.com/gm-gb-test/minc/safehands_transparent_cut.gif"}/>
  );
}

export const GifTalkr = GifTalkrB.bind({});