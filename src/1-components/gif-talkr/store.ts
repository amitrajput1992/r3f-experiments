import create from "zustand";

export const useStore = create<Store>((set) => ({
  selectedVoice: null,
  setSelectedVoice: (selectedVoice) => set({ selectedVoice }),
  // gifURL: "https://s.vrgmetri.com/gm-gb-test/minc/safehands_transparent_cut.gif",
  gifURL: "https://i.imgur.com/ork8hoP.gif",
  // gifURL: "https://i.imgur.com/YpKsOQS.gif",
  setGifURL: (gifURL) => set({ gifURL }),
  // tts: "yolo. habibi wassup nisss",
  tts: "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.",
  setTts: (tts: string) => set({ tts }),
  allVoices: [],
  setAllVoices: (allVoices) => set({ allVoices }),
}));

type Store = {
  selectedVoice: SpeechSynthesisVoice | null,
  setSelectedVoice: (selectedVoice: SpeechSynthesisVoice) => void,
  gifURL: string,
  setGifURL: (gifURL: string) => void,
  tts: string,
  setTts: (tts: string) => void,
  allVoices: SpeechSynthesisVoice[],
  setAllVoices: (allVoices: SpeechSynthesisVoice[]) => void
};