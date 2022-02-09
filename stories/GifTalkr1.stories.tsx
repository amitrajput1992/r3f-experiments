import React from "react";
import GifTalkrC from "../src/1-components/gif-talkr";

export default {
  title: "Gif Talkr 1",
};

const GifTalkrB = () => {
  return (
    <GifTalkrC gifURL={"https://i.imgur.com/ork8hoP.gif"}/>
  );
}

export const GifTalkr = GifTalkrB.bind({});