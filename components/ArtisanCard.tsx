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
  description: string;
  videoCommands?: {
    bio?: string;
    craft?: string;
  };
};

type Props = {
  artisan: Artisan;
  index: number;
  animationValue: SharedValue<number>;
};

const portraitMap: Record<string, any> = {
  default: require("../assets/images/DefaultPortrait.png"),
  // add portrait mappings here
};

// Configuration constants for easy ratio adjustments
const LAYOUT_CONFIG = {
  portraitRatio: 0.65, // % of card height
  contentRatio: 0.35, // % of card height
  titleRatio: 0.4, // % of content section
  descriptionRatio: 0.2, // % of content section
  buttonsRatio: 0.4, // % of content section
};

export default function ArtisanCard({ artisan, index, animationValue }: Props) {
  const router = useRouter();

  const handlePress = () => {
    // for handling pressing on the card and going to another screen.
    // not needed for bio app, add for Q&A
  };

  const handleVideoPress = async (videoType: "bio" | "craft") => {
    const command = artisan.videoCommands?.[videoType];

    if (!command) {
      console.warn(`⚠️ No command configured for ${videoType} video.`);
      return;
    }

    console.log(`Command to send: "${command}"`);

    try {
      // Load IP and port from AsyncStorage
      const ip =
        (await AsyncStorage.getItem("museum_ip_address")) ?? "192.168.1.100";
      const port = (await AsyncStorage.getItem("museum_port")) ?? "8080";

      console.log(`Loaded IP and port: ${ip}:${port}`);

      await sendUdpCommand({
        ip,
        port,
        message: command,
      });

      console.log("✅ UDP command sent successfully");
    } catch (err) {
      console.error("❌ Failed to send UDP command:", err);
    }
  };

  const imageSource =
    artisan.portraitPath && portraitMap[artisan.portraitPath]
      ? portraitMap[artisan.portraitPath]
      : portraitMap["default"];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.95}
      >
        {/* Portrait Section */}
        <View style={styles.portraitDividerTop} />
        <View
          style={[
            styles.portraitSection,
            { height: `${LAYOUT_CONFIG.portraitRatio * 100}%` },
          ]}
        >
          <Image
            source={imageSource}
            style={styles.portrait}
            resizeMode="cover"
          />
        </View>
        <View style={styles.portraitDividerBottom} />
        {/* Content Section */}
        <View
          style={[
            styles.contentSection,
            { height: `${LAYOUT_CONFIG.contentRatio * 100}%` },
          ]}
        >
          {/* Name and Trade */}
          <View
            style={[
              styles.titleSection,
              { height: `${LAYOUT_CONFIG.titleRatio * 100}%` },
            ]}
          >
            <Text
              style={styles.name}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {artisan.name}
            </Text>
            <View style={styles.divider} />
            <Text
              style={styles.trade}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {artisan.trade}
            </Text>
          </View>

          {/* Description */}

          {/* Video Buttons */}
          <View
            style={[
              styles.buttonSection,
              { height: `${LAYOUT_CONFIG.buttonsRatio * 100}%` },
            ]}
          >
            <TouchableOpacity
              style={[styles.videoButton, styles.introButton]}
              onPress={() => handleVideoPress("bio")}
              activeOpacity={0.8}
            >
              
              <Text style={styles.buttonBioText}>Play Bio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.videoButton, styles.craftButton]}
              onPress={() => handleVideoPress("craft")}
              activeOpacity={0.8}
            >
              
              <Text style={styles.buttonCraftText}>See Their Craft</Text>
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
    width: "100%",
    height: "100%",
    backgroundColor: "#F8F5F0",
    borderWidth: 2,
    borderColor: "#9C8374",
    borderRadius: 16,
    overflow: "hidden", // <-- key addition
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 19.84,
  },

  divider: {
    width: "30%",
    height: 2,
    backgroundColor: "#9C8374",
    marginVertical: 6,
    alignSelf: "center",
  },
  portraitDividerBottom: {
    height: 15,
    width: "100%",
    backgroundColor: "#A0B8BD",
    marginTop: -1,
  },
  portraitDividerTop: {
    height: 15,
    width: "100%",
    backgroundColor: "#C37E5D",
    marginTop: -1,
  },

  portraitSection: {
    width: "100%",
    overflow: "hidden",
    borderBottomWidth: 1,
    borderColor: "#E9CBA7",
  },
  portrait: {
    width: "100%",
    height: "100%",
  },
  contentSection: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#F8F5F0",
  },
  titleSection: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    marginBottom: 8,
    minHeight: 130,
  },
  name: {
    fontSize: 76,
    fontFamily: "FreightDisp-Bold",
    color: "#39505D",
    textAlign: "center",
    flexShrink: 1,
    marginBottom: 4,
  },
  trade: {
    fontSize: 36,
    fontFamily: "AcuminPro-Regular",
    color: "#39505D",
    textAlign: "center",
    textTransform: "uppercase",
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    position: "relative", // Required for absolute icon
  },
  buttonIconAbsolute: {
    position: "absolute",
    right: 30,
  },
  introButton: {
    borderColor: "#A0B8BD", // Cool blue tone
    backgroundColor: "#d8e7ed", // Soft blue-tinted ivory
  },
  craftButton: {
    borderColor: "#C37E5D", // Warm terracotta
    backgroundColor: "#F3D5C0", // Subtle warm ivory
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonIcon: {
    marginRight: 12,
  },

  buttonBioText: {
    color: "#39505D",
    fontSize: 50,
    fontFamily: "FreightDisp-Bold",
    textAlign: "center",
  },
  buttonCraftText: {
    color: "#634334",
    fontSize: 50,
    fontFamily: "FreightDisp-Bold",
    textAlign: "center",
  },
});
