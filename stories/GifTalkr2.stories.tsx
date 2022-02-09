import React from "react";
import GifTalkrC from "../src/1-components/gif-talkr";

export default {
  title: "Gif Talkr 2",
};

const GifTalkrB = () => {
  return (
    <GifTalkrC gifURL={"https://gm-gb-test.s3.ap-south-1.amazonaws.com/minc/safehands_transparent_cut.gif"}/>
    // <GifTalkrC gifURL={"https://u.vrgmetri.com/gm-gb-test/minc/safehands_transparent_cut.gif"}/>
  );
}

export const GifTalkr = GifTalkrB.bind({});