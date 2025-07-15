import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

import artisans from "../assets/artisans.json";
import ArtisanCard from "../components/ArtisanCard";
import HiddenMaintenanceTrigger from "../components/HiddenMaintenanceTrigger";
import QuestionOverlay from "@/components/QuestionOverlay";
import questionsData from "@/assets/artisan_questions.json";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  const ref = React.useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");
  const progress = useSharedValue<number>(0);
  const router = useRouter();
 const [selectedArtisanName, setSelectedArtisanName] = useState<string | null>(null);
const scrollEnabled = selectedArtisanName === null;


  const [useGradientBackground, setUseGradientBackground] = useState(false); // ← toggle

  const background = require("../assets/images/CTA_ipad_BG.png");
  const CARD_WIDTH = width;
  const CARD_HEIGHT = height * 1;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  if (width === 0 || height === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* BACKGROUND */}
      {useGradientBackground ? (
        <LinearGradient
          colors={["#F8F5F0", "#D9C2AA"]}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <Image source={background} style={styles.backgroundImage} />
      )}
      <View style={styles.overlay} />

      {/* CAROUSEL */}
      <Carousel
        ref={ref}
        data={artisans}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        style={{ width }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.77,
          parallaxScrollingOffset: CARD_WIDTH * 0.27,
          parallaxAdjacentItemScale: 0.7,
        }}
        pagingEnabled
        snapEnabled
        loop
        autoPlay={false}
        scrollAnimationDuration={900}
        onProgressChange={progress}
        renderItem={({ item, index, animationValue }) => (
          <ArtisanCard
            artisan={item}
            index={index}
            animationValue={animationValue}
            onAskQuestion={setSelectedArtisanName}
          />
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={artisans}
        dotStyle={{
          width: 20,
          height: 20,
          backgroundColor: "#E0D7C8",
          borderRadius: 50,
          marginBottom: 25
        }}
        activeDotStyle={{
          borderRadius: 100,
          backgroundColor: "#39505D",
        }}
        containerStyle={{ gap: 5, marginTop: -30 }}
        onPress={onPressPagination}
      />

      <HiddenMaintenanceTrigger
        onActivate={() => router.push("/maintenance")}
      />
       {selectedArtisanName && (
        <QuestionOverlay
          artisanName={selectedArtisanName}
          onClose={() => setSelectedArtisanName(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    transform: [{ translateX: -700 }, { translateY: -350 }, { scale: 0.7 }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.0)", // adjust opacity as needed
    zIndex: 0, // Ensure it sits above background but below content
  },
  toggleButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 999,
  },
  toggleText: {
    color: "#333",
    fontFamily: "AcuminPro-Regular",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
});
