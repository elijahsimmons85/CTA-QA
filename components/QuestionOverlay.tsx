import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendUdpCommand } from "@/utils/sendUDPCommand";
import questionsData from "../assets/artisan_questions.json";

type Props = {
  artisanName: string;
  onClose: () => void;
};

const QuestionOverlay = ({ artisanName, onClose }: Props) => {
  const slideAnim = useSharedValue(1000);
  const artisanQuestions =
    questionsData[artisanName as keyof typeof questionsData]?.questions ?? [];

  useEffect(() => {
    slideAnim.value = withTiming(0, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  const handleClose = () => {
    slideAnim.value = withTiming(1000, { duration: 300 });
    setTimeout(onClose, 300);
  };

  const handleQuestionPress = async (command: string) => {
    const ip = (await AsyncStorage.getItem("museum_ip_address")) ?? "192.168.1.100";
    const port = (await AsyncStorage.getItem("museum_port")) ?? "8080";
    await sendUdpCommand({ ip, port, message: command });
  };

  const renderItem = ({ item }: { item: { key: string; text: string } }) => (
    <TouchableOpacity
      style={styles.questionItem}
      activeOpacity={0.8}
      delayPressIn={150}
      onPressOut={() => handleQuestionPress(item.key)}
    >
      <Text style={styles.questionText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableOpacity onPress={handleClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#39505D" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <FlatList
          data={artisanQuestions}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    position: "absolute",
    zIndex: 1000,
    bottom: 0,
    left: 40,
    right: 40,
    maxHeight: "80%",
    backgroundColor: "#F8F5F0",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#9C8374",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backText: {
    fontSize: 20,
    fontFamily: "AcuminPro-Regular",
    color: "#39505D",
    marginLeft: 8,
  },
  questionItem: {
    paddingVertical: 16,
    borderBottomColor: "#D6CCC2",
    borderBottomWidth: 1,
  },
  questionText: {
    fontSize: 22,
    fontFamily: "AcuminPro-Regular",
    color: "#2C2B28",
  },
});

export default QuestionOverlay;
