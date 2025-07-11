import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
};

type Props = {
  artisan: Artisan;
  index: number;
  animationValue: SharedValue<number>;
  onAskPress: () => void;
};

const portraitMap: Record<string, any> = {
  default: require("../assets/images/DefaultPortrait.png"),
  // add portrait mappings here
};

const LAYOUT_CONFIG = {
  portraitRatio: 0.65,
  contentRatio: 0.35,
  titleRatio: 0.4,
  descriptionRatio: 0.2,
  buttonsRatio: 0.4,
};

export default function ArtisanCard({
  artisan,
  animationValue,
  onAskPress,
}: Props) {
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
      <View style={styles.card}>
        <View style={styles.portraitDividerTop} />
        <View
          style={[
            styles.portraitSection,
            { height: `${LAYOUT_CONFIG.portraitRatio * 100}%` },
          ]}
        >
          <Image source={imageSource} style={styles.portrait} resizeMode="cover" />
        </View>
        <View style={styles.portraitDividerBottom} />

        <View
          style={[
            styles.contentSection,
            { height: `${LAYOUT_CONFIG.contentRatio * 100}%` },
          ]}
        >
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

          <View
            style={[
              styles.buttonSection,
              { height: `${LAYOUT_CONFIG.buttonsRatio * 100}%` },
            ]}
          >
            <TouchableOpacity
              style={[styles.videoButton, styles.askButton]}
              onPress={onAskPress}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubble-ellipses" size={34} color="#39505D" style={styles.buttonIcon} />
              <Text style={styles.askText}>Ask {artisan.name} a Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F8F5F0",
    borderWidth: 2,
    borderColor: "#9C8374",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 19.84,
  },
  portraitDividerTop: {
    height: 15,
    width: "100%",
    backgroundColor: "#C37E5D",
  },
  portraitDividerBottom: {
    height: 15,
    width: "100%",
    backgroundColor: "#A0B8BD",
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
  divider: {
    width: "30%",
    height: 2,
    backgroundColor: "#9C8374",
    marginVertical: 6,
    alignSelf: "center",
  },
  buttonSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  videoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  askButton: {
    width: "60%",
    height: "80%",
    backgroundColor: "#E1EDF0",
    borderColor: "#A0B8BD",
  },
  buttonIcon: {
    marginRight: 12,
  },
  askText: {
    fontSize: 38,
    fontFamily: "FreightDisp-Bold",
    color: "#39505D",
    textAlign: "center",
  },
});
