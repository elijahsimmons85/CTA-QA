import { sendUdpCommand } from "@/utils/sendUDPCommand";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Artisan = {
  id: string;
  name: string;
  trade: string;
  portraitPath: string;
  videoCommands?: {
    bio?: string;
    craft?: string;
  };
};

type Props = {
  artisan: Artisan;
  index: number;
  animationValue: SharedValue<number>;
  onAskQuestion: (name: string) => void;
};

const portraitMap: Record<string, any> = {
  default: require("../assets/images/DefaultPortrait.png"),
  "AErickson.png": require("../assets/images/Artisans/CTA_HS_AErickson.png"),
  "BBriddle.png": require("../assets/images/Artisans/CTA_HS_BBriddle.png"),
  "EMarsh.png": require("../assets/images/Artisans/CTA_HS_EMarsh.png"),
  "JBrainard.png": require("../assets/images/Artisans/CTA_HS_JBrainard.png"),
  "KSeidel.png": require("../assets/images/Artisans/CTA_HS_KSeidel.png"),
  "TWatson.png": require("../assets/images/Artisans/CTA_HS_TWatson.png"),
};

const LAYOUT_CONFIG = {
  portraitRatio: 0.55,
  contentRatio: 0.45,
  titleRatio: 0.4,
  buttonsRatio: 0.3,
};

export default function ArtisanCard({ artisan, index, animationValue, onAskQuestion }: Props) {
  const router = useRouter();

  const handlePress = () => {
    // intentionally left empty
  };

  const handleVideoPress = async (videoType: "bio" | "craft") => {
    const command = artisan.videoCommands?.[videoType];
    if (!command) {
      console.warn(`⚠️ No command configured for ${videoType} video.`);
      return;
    }

    try {
      const ip = (await AsyncStorage.getItem("museum_ip_address")) ?? "192.168.1.100";
      const port = (await AsyncStorage.getItem("museum_port")) ?? "8080";

      await sendUdpCommand({ ip, port, message: command });
    } catch (err) {
      console.error("❌ Failed to send UDP command:", err);
    }
  };

  const imageSource =
    artisan.portraitPath && portraitMap[artisan.portraitPath]
      ? portraitMap[artisan.portraitPath]
      : portraitMap["default"];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [-1, 0, 1], [0.9, 1, 0.9], Extrapolate.CLAMP);
    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={1}>
        {/* Portrait */}
        <View style={[styles.portraitSection, { height: `${LAYOUT_CONFIG.portraitRatio * 100}%` }]}>
          <Image source={imageSource} style={styles.portrait} resizeMode="cover" />
        </View>

        {/* Content */}
        <View style={[styles.contentSection, { height: `${LAYOUT_CONFIG.contentRatio * 100}%` }]}>
          <View style={[styles.titleSection, { height: `${LAYOUT_CONFIG.titleRatio * 100}%` }]}>
            <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {artisan.name.toUpperCase()}
            </Text>
            <Text style={styles.trade} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {artisan.trade}
            </Text>
          </View>

          {/* Buttons */}
          <View style={[styles.buttonSection, { height: `${LAYOUT_CONFIG.buttonsRatio * 100}%` }]}>
            <TouchableOpacity
              style={[styles.videoButton]}
              onPress={() => onAskQuestion(artisan.name)}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Ask {artisan.name.split(" ")[0]} a Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "95%",
    height: "115%",
    backgroundColor: "#F8F5F0",
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 30.84,
    elevation: 10,
  },
  portraitSection: {
    width: "100%",
    overflow: "hidden",
    borderBottomWidth: 1,
    borderColor: "#E9CBA7",
    transform: [{ translateX: -0 }, { translateY: -0 }, { scale: 1 }],

  },
  portrait: {
    width: "100%",
    height: "100%",
  },
  contentSection: {
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#F8F5F0",
  },
  titleSection: {
    borderColor: "#8E7565",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    marginBottom: 8,
    padding: 15,
    minHeight: 130,
    margin: 0,
  },
  name: {
    fontSize: 96,
    fontFamily: "FreightDisp-Bold",
    color: "#39505D",
    textAlign: "center",
    flexShrink: 1,
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  trade: {
    fontSize: 54,
    fontFamily: "AcuminPro-Regular",
    color: "#39505D",
    textAlign: "center",
    letterSpacing: 1,
  },
  descriptionSection: {
    paddingVertical: 8,
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "AcuminPro-Regular",
    color: "#2C2B28",
    lineHeight: 22,
    textAlign: "center",
  },
  buttonSection: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  videoButton: {
    marginHorizontal: 120,
    height: "70%",
    marginTop: 45,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    margin: 9,
    backgroundColor: "#BA7F60",
    position: "relative",
  },
  buttonText: {
    fontSize: 50,
    fontFamily: "AcuminPro-Thin",
    color: "#F8F5F0",
    textAlign: "center",
  },
});
