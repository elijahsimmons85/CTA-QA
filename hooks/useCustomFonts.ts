import * as Font from "expo-font";

export function useCustomFonts() {
  return Font.useFonts({
    "FreightDisp-Bold": require("../assets/fonts/FreightDispBold.otf"),
    "AcuminPro-Regular": require("../assets/fonts/Acumin-RPro.otf"),
    "AcuminPro-Thin": require("../assets/fonts/acumin-pro-light.ttf"),
  });
}
