import React, { useState } from "react";
import GifTalkrC from "../src/1-components/gif-talkr";

export default {
  title: "Gif Talkr 1",
};

const GifTalkrB = () => {
  const [gifUrl, setGifUrl] = useState("https://i.imgur.com/ork8hoP.gif");
  return (
    <>
      Enter GIF URL: <input type={"text"} value={gifUrl} onChange={e => setGifUrl(e.target.value)}/>
      <GifTalkrC gifURL={gifUrl}/>
    </>
  );
}

export const GifTalkr = GifTalkrB.bind({});