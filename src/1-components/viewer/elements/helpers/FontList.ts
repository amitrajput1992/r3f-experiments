export const enum FontFamily {
  "Roboto" = "Roboto",
  "RobotoMono" = "RobotoMono",
  "Lato" = "Lato",
  "Montserrat" = "Montserrat",
  "Oswald" = "Oswald",
  "Nunito" = "Nunito",
  "NunitoSans" = "NunitoSans",
}

const fontPrefix = "https://gm-gb-test.s3.ap-south-1.amazonaws.com/r3f-ui/assets/fonts/";
const defaultFont = `${fontPrefix}Montserrat/Montserrat-Medium.ttf`;

export const getClosestFontPath = ({ face = FontFamily.Montserrat, weight = 500, italics = false }: {
  face?: FontFamily, weight?: number, italics?: boolean
}): string => {
  const fontWeightList = fontMap[face];
  if (fontWeightList === undefined) {
    return defaultFont;
  }

  const weights = Object.keys(fontWeightList).map(n => parseInt(n));
  //find the closest weight greater or equal to passed weight
  const closestMatch = weights.reduce((p, c) => (p >= weight ? p : c), 100);
  const fontWithWeight = fontWeightList[closestMatch];
  if (italics && (fontWithWeight.i !== undefined)) {
    return `${fontPrefix}${face}/${fontWithWeight.i}`;
  } else {
    return `${fontPrefix}${face}/${fontWithWeight.n}`;
  }
};

const weightToPrefix = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

const fontMap: Partial<Record<FontFamily, Record<number, { n: string, i?: string }>>> = {
  [FontFamily.Roboto]: {
    100: { n: "Roboto-Thin.ttf", i: "Roboto-ThinItalic.ttf" },
    300: { n: "Roboto-Light.ttf", i: "Roboto-LightItalic.ttf" },
    400: { n: "Roboto-Regular.ttf", i: "Roboto-Italic.ttf" },
    500: { n: "Roboto-Medium.ttf", i: "Roboto-MediumItalic.ttf" },
    700: { n: "Roboto-Bold.ttf", i: "Roboto-BoldItalic.ttf" },
    900: { n: "Roboto-Black.ttf", i: "Roboto-BlackItalic.ttf" },
  },
  [FontFamily.Lato]: {
    100: { n: "Lato-Thin.ttf", i: "Lato-ThinItalic.ttf" },
    300: { n: "Lato-Light.ttf", i: "Lato-LightItalic.ttf" },
    400: { n: "Lato-Regular.ttf", i: "Lato-Italic.ttf" },
    700: { n: "Lato-Bold.ttf", i: "Lato-BoldItalic.ttf" },
    900: { n: "Lato-Black.ttf", i: "Lato-BlackItalic.ttf" },
  },
  [FontFamily.Montserrat]: {
    100: { n: "Montserrat-Thin.ttf", i: "Montserrat-ThinItalic.ttf" },
    200: { n: "Montserrat-ExtraLight.ttf", i: "Montserrat-ExtraLightItalic.ttf" },
    300: { n: "Montserrat-Light.ttf", i: "Montserrat-LightItalic.ttf" },
    400: { n: "Montserrat-Regular.ttf", i: "Montserrat-Italic.ttf" },
    500: { n: "Montserrat-Medium.ttf", i: "Montserrat-MediumItalic.ttf" },
    600: { n: "Montserrat-SemiBold.ttf", i: "Montserrat-SemiBoldItalic.ttf" },
    700: { n: "Montserrat-Bold.ttf", i: "Montserrat-BoldItalic.ttf" },
    800: { n: "Montserrat-ExtraBold.ttf", i: "Montserrat-ExtraBoldItalic.ttf" },
    900: { n: "Montserrat-Black.ttf", i: "Montserrat-BlackItalic.ttf" },
  },
  [FontFamily.Oswald]: {
    200: { n: "Oswald-ExtraLight.ttf" },
    300: { n: "Oswald-Light.ttf" },
    400: { n: "Oswald-Regular.ttf" },
    500: { n: "Oswald-Medium.ttf" },
    600: { n: "Oswald-SemiBold.ttf" },
    700: { n: "Oswald-Bold.ttf" },
  },
  [FontFamily.Nunito]: {
    200: { n: "Nunito-ExtraLight.ttf", i: "Nunito-ExtraLightItalic.ttf" },
    300: { n: "Nunito-Light.ttf", i: "Nunito-LightItalic.ttf" },
    400: { n: "Nunito-Regular.ttf", i: "Nunito-Italic.ttf" },
    600: { n: "Nunito-SemiBold.ttf", i: "Nunito-SemiBoldItalic.ttf" },
    700: { n: "Nunito-Bold.ttf", i: "Nunito-BoldItalic.ttf" },
    800: { n: "Nunito-ExtraBold.ttf", i: "Nunito-ExtraBoldItalic.ttf" },
    900: { n: "Nunito-Black.ttf", i: "Nunito-BlackItalic.ttf" },
  },
  [FontFamily.NunitoSans]: {
    200: { n: "NunitoSans-ExtraLight.ttf", i: "NunitoSans-ExtraLightItalic.ttf" },
    300: { n: "NunitoSans-Light.ttf", i: "NunitoSans-LightItalic.ttf" },
    400: { n: "NunitoSans-Regular.ttf", i: "NunitoSans-Italic.ttf" },
    600: { n: "NunitoSans-SemiBold.ttf", i: "NunitoSans-SemiBoldItalic.ttf" },
    700: { n: "NunitoSans-Bold.ttf", i: "NunitoSans-BoldItalic.ttf" },
    800: { n: "NunitoSans-ExtraBold.ttf", i: "NunitoSans-ExtraBoldItalic.ttf" },
    900: { n: "NunitoSans-Black.ttf", i: "NunitoSans-BlackItalic.ttf" },
  },
  [FontFamily.Roboto]: {
    100: { n: "Roboto-Thin.ttf", i: "Roboto-ThinItalic.ttf" },
    300: { n: "Roboto-Light.ttf", i: "Roboto-LightItalic.ttf" },
    400: { n: "Roboto-Regular.ttf", i: "Roboto-Italic.ttf" },
    500: { n: "Roboto-Medium.ttf", i: "Roboto-MediumItalic.ttf" },
    700: { n: "Roboto-Bold.ttf", i: "Roboto-BoldItalic.ttf" },
    900: { n: "Roboto-Black.ttf", i: "Roboto-BlackItalic.ttf" },
  },
};


/**
 * Path format: https://s.vrgmetri.com/gb-web/r3f-ui/assets/fonts/Lato/Lato-ThinItalic.ttf
 * For downloading, google fonts website: https://fonts.google.com/specimen/Oswald?preview.text_type=custom
 *
 * For uploading more fonts go here: https://minio-tech.stage.gmetri.io/minio/gb-web/r3f-ui/assets/fonts/
 * (After logging in from g3d.in/assets)
 *
 Currently Uploaded list:
 .
 ./RobotoMono
 ./RobotoMono/RobotoMono-ExtraLight.ttf
 ./RobotoMono/RobotoMono-ThinItalic.ttf
 ./RobotoMono/RobotoMono-SemiBold.ttf
 ./RobotoMono/RobotoMono-Bold.ttf
 ./RobotoMono/RobotoMono-Light.ttf
 ./RobotoMono/RobotoMono-Medium.ttf
 ./RobotoMono/RobotoMono-SemiBoldItalic.ttf
 ./RobotoMono/RobotoMono-BoldItalic.ttf
 ./RobotoMono/RobotoMono-ExtraLightItalic.ttf
 ./RobotoMono/RobotoMono-Regular.ttf
 ./RobotoMono/RobotoMono-Thin.ttf
 ./RobotoMono/RobotoMono-MediumItalic.ttf
 ./RobotoMono/RobotoMono-Italic.ttf
 ./RobotoMono/RobotoMono-LightItalic.ttf
 ./Lato
 ./Lato/Lato-BlackItalic.ttf
 ./Lato/Lato-Light.ttf
 ./Lato/Lato-BoldItalic.ttf
 ./Lato/Lato-Bold.ttf
 ./Lato/Lato-Thin.ttf
 ./Lato/Lato-Black.ttf
 ./Lato/Lato-Regular.ttf
 ./Lato/Lato-LightItalic.ttf
 ./Lato/Lato-ThinItalic.ttf
 ./Lato/Lato-Italic.ttf
 ./Montserrat
 ./Montserrat/Montserrat-Medium.ttf
 ./Montserrat/Montserrat-Regular.ttf
 ./Montserrat/Montserrat-BlackItalic.ttf
 ./Montserrat/Montserrat-SemiBoldItalic.ttf
 ./Montserrat/Montserrat-Italic.ttf
 ./Montserrat/Montserrat-Black.ttf
 ./Montserrat/Montserrat-LightItalic.ttf
 ./Montserrat/Montserrat-ExtraBoldItalic.ttf
 ./Montserrat/Montserrat-BoldItalic.ttf
 ./Montserrat/Montserrat-Bold.ttf
 ./Montserrat/Montserrat-Light.ttf
 ./Montserrat/Montserrat-SemiBold.ttf
 ./Montserrat/Montserrat-Thin.ttf
 ./Montserrat/Montserrat-ThinItalic.ttf
 ./Montserrat/Montserrat-ExtraBold.ttf
 ./Montserrat/Montserrat-ExtraLight.ttf
 ./Montserrat/Montserrat-MediumItalic.ttf
 ./Montserrat/Montserrat-ExtraLightItalic.ttf
 ./Oswald
 ./Oswald/Oswald-ExtraLight.ttf
 ./Oswald/Oswald-Regular.ttf
 ./Oswald/Oswald-Bold.ttf
 ./Oswald/Oswald-SemiBold.ttf
 ./Oswald/Oswald-Medium.ttf
 ./Oswald/Oswald-Light.ttf
 ./Nunito
 ./Nunito/Nunito-LightItalic.ttf
 ./Nunito/Nunito-ExtraLightItalic.ttf
 ./Nunito/Nunito-Italic.ttf
 ./Nunito/Nunito-Bold.ttf
 ./Nunito/Nunito-BoldItalic.ttf
 ./Nunito/Nunito-Regular.ttf
 ./Nunito/Nunito-SemiBold.ttf
 ./Nunito/Nunito-ExtraBold.ttf
 ./Nunito/Nunito-ExtraLight.ttf
 ./Nunito/Nunito-SemiBoldItalic.ttf
 ./Nunito/Nunito-ExtraBoldItalic.ttf
 ./Nunito/Nunito-Black.ttf
 ./Nunito/Nunito-BlackItalic.ttf
 ./Nunito/Nunito-Light.ttf
 ./NunitoSans
 ./NunitoSans/NunitoSans-Regular.ttf
 ./NunitoSans/NunitoSans-SemiBoldItalic.ttf
 ./NunitoSans/NunitoSans-ExtraBold.ttf
 ./NunitoSans/NunitoSans-SemiBold.ttf
 ./NunitoSans/NunitoSans-BoldItalic.ttf
 ./NunitoSans/NunitoSans-Italic.ttf
 ./NunitoSans/NunitoSans-Black.ttf
 ./NunitoSans/NunitoSans-BlackItalic.ttf
 ./NunitoSans/NunitoSans-Bold.ttf
 ./NunitoSans/NunitoSans-LightItalic.ttf
 ./NunitoSans/NunitoSans-ExtraBoldItalic.ttf
 ./NunitoSans/NunitoSans-ExtraLightItalic.ttf
 ./NunitoSans/NunitoSans-ExtraLight.ttf
 ./NunitoSans/NunitoSans-Light.ttf
 ./Roboto
 ./Roboto/Roboto-Black.ttf
 ./Roboto/Roboto-Regular.ttf
 ./Roboto/Roboto-ThinItalic.ttf
 ./Roboto/Roboto-Light.ttf
 ./Roboto/Roboto-Bold.ttf
 ./Roboto/Roboto-BoldItalic.ttf
 ./Roboto/Roboto-Italic.ttf
 ./Roboto/Roboto-MediumItalic.ttf
 ./Roboto/Roboto-LightItalic.ttf
 ./Roboto/Roboto-Medium.ttf
 ./Roboto/Roboto-Thin.ttf
 ./Roboto/Roboto-BlackItalic.ttf

 */