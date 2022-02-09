import React, { useEffect, useRef, useState } from "react";
import SuperGif from "../../libgif";
import { useStore } from "../../store";
import { ClampToEdgeWrapping, DoubleSide, Texture } from "three";
import { useFrame } from "@react-three/fiber";

const options = {
  autoplay_blinks: false,
  auto_play: false,
  show_progress_bar: false
};

const Talkr = ({gifURL}: {gifURL: string}) => {
  // @ts-ignore
  const superGif = useRef(new SuperGif(options));
  const playDuration = useRef(0);
  const [tex, setTexture] = useState(new Texture());
  tex.wrapS = ClampToEdgeWrapping;
  tex.wrapT = ClampToEdgeWrapping;

  useEffect(() => {
    // cancel speakign when this component is re-mounted to avoid an orphan state
    if(speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    return () => {
      if(speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if(speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    // const img = document.getElementById("imagecontainer") as HTMLImageElement;
    const img = document.createElement("img");
    img.src = gifURL;
    // @ts-ignore
    img.animatedSrc = gifURL;
    img.setAttribute("rel:animated_src", gifURL);
    img.setAttribute("rel:auto_play", "0");
    img.style.width = "10px";
    document.getElementById("domcontainer")?.appendChild(img);
    superGif.current.destroy();

    // @ts-ignore
    superGif.current = new SuperGif({gif: img, ...options});
    superGif.current.load(() => {
      console.log(" GIF loaded");
      const cnv = superGif.current.get_canvas();
      const tex = new Texture(cnv);
      setTexture(tex);
      tex.wrapS = ClampToEdgeWrapping;
      tex.wrapT = ClampToEdgeWrapping;
      tex.needsUpdate = true;
    });

    function playsyncronized() {
      const voice = useStore.getState().selectedVoice;
      // if already speaking, don't do anything
      if(speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      if(voice === null) {
        return;
      }

      const tts = useStore.getState().tts;

      // Splitting each utterance up using punctuation is important.  Intra-utterance
      // punctuation will add silence to the tts which looks bad unless the mouth stops moving
      // correctly. Better to split it into separate utterances so play_for_duration will move when
      // talking, and be on frame 0 when not.

      // split everything between deliminators [.?,!], but include the deliminator.
      const substrings = tts.match(/[^.?,!]+[.?,!]?/g) as any[];
      // console.log(substrings);

      for (let i = 0; i < substrings.length; ++i) {
        const str = substrings[i].trim();

        // Make sure there is something to say other than the deliminator
        const numpunc = (str.match(/[.?,!]/g) || []).length;
        if (str.length - numpunc > 0) {
          // suprisingly decent approximation for multiple languages.

          // if you change the rate, you would have to adjust
          let duration = str.length * 50;

          // Chinese needs a different calculation.  Haven't tried other Asian languages.
          if (str.match(/[\u3400-\u9FBF]/)) {
            duration = str.length * 200;
          }
          // console.log(str, duration);
          const msg = new SpeechSynthesisUtterance();

          // The end event is too inacurate to use for animation,
          // but perhaps it could be used elsewhere.  You might need to push
          // the msg to an array or aggressive garbage collection fill prevent the callback
          // from firing.
          msg.onstart = () => {
            console.log("starting");
            superGif.current.play_for_duration(duration);
          };
          // msg.addEventListener("end", function() {
          //   console.log("too late");
          // });

          msg.text = str;
          //change voice here
          msg.voice = voice;

          // console.log(msg);

          window.speechSynthesis.speak(msg);
        }
      }
    }

    document.getElementById("play")?.addEventListener("click", playsyncronized);

    return () => {
      superGif.current.destroy();
      document.getElementById("play")?.removeEventListener("click", playsyncronized);
    };

  }, [gifURL]);

  useFrame(() => {
    if(tex.image) {
      tex.needsUpdate = true;
    }
  });

  return (
    <mesh userData={{needsRenderOrder: true}}>
      <planeBufferGeometry attach="geometry" args={[5, 10]} />
      <meshBasicMaterial
        attach="material"
        map={tex}
        side={DoubleSide}
        opacity={1}
        transparent={true}
      />

    </mesh>
  );
};

export default Talkr;