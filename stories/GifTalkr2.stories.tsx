import React, { useState } from "react";
import GifTalkrC from "../src/1-components/gif-talkr";
import { useStore } from "@react-three/fiber";

export default {
  title: "Gif Talkr 2",
};

const GifTalkrB = () => {
  const [gifUrl, setGifUrl] = useState("https://gm-gb-test.s3.ap-south-1.amazonaws.com/minc/safehands_transparent_cut.gif");
  return (
    <>
      Enter GIF URL: <input type={"text"} value={gifUrl} onChange={e => setGifUrl(e.target.value)}/>
      <GifTalkrC gifURL={gifUrl}/>
    </>
  );
}

export const GifTalkr = GifTalkrB.bind({});