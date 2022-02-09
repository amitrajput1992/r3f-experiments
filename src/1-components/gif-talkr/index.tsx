import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import Div100vh from "react-div-100vh";
import Talkr from "./components/Talkr";
import OrbitControls from "../controls/OrbitControls/OrbitControls";
import { useStore } from "./store";
import { CanvasContainer, DOMContainer } from "./styles";
import Pano from "../viewer/elements/definitions/3d/PanoImage/PanoImageR";
import PanoJson from "../../../stories/json/pano.json";
import { RenderOrder } from "../viewer/canvas/RenderOrder";

const GifTalkr = ({gifURL}: {gifURL: string}) => {
  useEffect(() => {
    if("speechSynthesis" in window === false) {
      alert("Speech Synthesis not available in your browsers.");
      return;
    }

    function onVoiceChange() {
      const voices = window.speechSynthesis.getVoices();
      /*// iOS returns voices it doesn't let you use.
      var bIsiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      var iOSVoiceSet = {};
      if( bIsiOS ){
        var array = ["Maged","Zuzana","Sara","Anna","Melina","Karen","Serena","Moira","Tessa","Samantha","Monica","Paulina","Satu","Amelie","Thomas","Carmit","Lekha","Mariska","Damayanti","Alice","Kyoko","Yuna","Ellen","Xander","Nora","Zosia","Luciana","Joana","Ioana","Milena","Laura","Alva","Kanya","Yelda","Ting-Ting","Sin-Ji","Mei-Jia"];
        array.forEach(function(val){
          iOSVoiceSet[val] = true;
        });
      }*/
      useStore.getState().setAllVoices(voices);
      useStore.getState().setSelectedVoice(voices[0]);
    }

    onVoiceChange();
    if(typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", onVoiceChange);
    }
    return () => {
      if(typeof window.speechSynthesis.addEventListener === "function") {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoiceChange);
      }
    };
  }, []);

  const allVoices = useStore(s => s.allVoices);
  const tts = useStore(s => s.tts);
  const setSelectedVoice = useStore.getState().setSelectedVoice;
  const setTts = useStore.getState().setTts;

  function onVoiceChange(e: React.ChangeEvent) {
    //@ts-ignore
    const v = e.target.value;
    const voice = allVoices.find(al => al.name === v);
    if(voice) {
      setSelectedVoice(voice);
    }
  }

  return (
    <Div100vh>
      <DOMContainer id={"domcontainer"}>
        <div>
          Enter TTS: <input value={tts} type={"text"} onChange={e => setTts(e.currentTarget.value)}/>
        </div>
        <div>
          Select Voice:
          <select name={"voices"} id={"voices"} onChange={onVoiceChange}>
            {
              allVoices.map((v, i) => <option key={i}>{v.name}</option>)
            }
          </select>
        </div>
        <div>
          <button id={"play"}> PLAY </button>
        </div>
      </DOMContainer>
      <CanvasContainer>
        <Canvas
          camera={{
            fov: 75,
            near: 0.01,
            far: 1500,
            position: [0, 0, 0],
            zoom: 1,
          }}
          dpr={window.devicePixelRatio}
          //toggle sRGB color management.
          linear={false}
        >
          <RenderOrder />
          <OrbitControls />
          <React.Suspense fallback={null}>
            <Pano json={PanoJson}/>
          </React.Suspense>
          <group position={[0, 0, -8]}>
            <Talkr gifURL={gifURL}/>
          </group>
        </Canvas>
      </CanvasContainer>
    </Div100vh>
  );
};

export default GifTalkr;