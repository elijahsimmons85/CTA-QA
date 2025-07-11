import { Stack } from "expo-router";
import { useCustomFonts } from "@/hooks/useCustomFonts";
import { View, ActivityIndicator } from "react-native";
import { Buffer } from "buffer";

export default function Layout() {
  global.Buffer = Buffer;
  const [fontsLoaded] = useCustomFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        presentation: "card",
      }}
    />
  );
}
