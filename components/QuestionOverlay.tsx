import React from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
FlatList,
Pressable,
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

type Artisan = {
id: string;
name: string;
trade: string;
portraitPath: string;
};

type Props = {
artisan: Artisan;
onClose: () => void;
};

export default function QuestionOverlay({ artisan, onClose }: Props) {
const slideAnim = useSharedValue(1000);
const normalizedName = Object.keys(questionsData).find(
  (key) => key.toLowerCase().trim() === artisan.name.toLowerCase().trim()
);

// Use type assertion only after confirming it's a valid key
const questions = normalizedName
  ? (questionsData as Record<string, { questions: { key: string; text: string }[] }>)
      [normalizedName].questions
  : [];


const animatedStyle = useAnimatedStyle(() => ({
transform: [{ translateY: slideAnim.value }],
}));

React.useEffect(() => {
slideAnim.value = withTiming(0, { duration: 300 });
}, []);

const handleClose = () => {
slideAnim.value = withTiming(1000, { duration: 300 });
setTimeout(onClose, 300);
};

const handleQuestionPress = async (command: string) => {
const ip = (await AsyncStorage.getItem("museum_ip_address")) ?? "192.168.1.100";
const port = (await AsyncStorage.getItem("museum_port")) ?? "8080";
await sendUdpCommand({ ip, port, message: command });
};

const renderQuestion = ({ item }: { item: { key: string; text: string } }) => {
  let moved = false;

  return (
    <Pressable
      style={styles.questionItem}
      onPress={() => {
        if (!moved) handleQuestionPress(item.key);
      }}
      onTouchMove={() => {
        moved = true;
      }}
      onTouchEnd={() => {
        setTimeout(() => (moved = false), 100); // reset for next touch
      }}
    >
      <Text style={styles.questionText}>{item.text}</Text>
    </Pressable>
  );
};



return (
<View style={StyleSheet.absoluteFill}>
<Pressable style={styles.backdrop} onPress={handleClose} />
<Animated.View style={[styles.container, animatedStyle]}>
<TouchableOpacity onPress={handleClose} style={styles.backButton}>
<Ionicons name="arrow-back" size={28} color="#39505D" />
<Text style={styles.backText}>Back</Text>
</TouchableOpacity>
<FlatList
  data={questions}
  keyExtractor={(item) => item.key}
  renderItem={renderQuestion}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator
  scrollEnabled={true}
  bounces={true}  // optional for iOS rubber band scroll
  scrollEventThrottle={16}
/>
</Animated.View>
</View>
);
}

const styles = StyleSheet.create({
backdrop: {
...StyleSheet.absoluteFillObject,
backgroundColor: "rgba(0,0,0,0.4)",
},
container: {
position: "absolute",
bottom: 0,
left: 20,
right: 20,
maxHeight: "80%",
backgroundColor: "#F8F5F0",
borderRadius: 24,
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
fontSize: 20,
fontFamily: "AcuminPro-Regular",
color: "#2C2B28",
},
});