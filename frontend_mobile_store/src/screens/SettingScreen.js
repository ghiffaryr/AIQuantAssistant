import React, { useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeOut } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

export default function SettingScreen({ navigation }) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const onLogoutPressed = async () => {
    try {
      await AsyncStorage.removeItem("user_email");
      await AsyncStorage.removeItem("user_name");
      await AsyncStorage.removeItem("user_role");
      await AsyncStorage.removeItem("user_token");
      await AsyncStorage.removeItem("token_type");

      dispatch({ type: "loggedOff" });
      setError("");

      navigation.reset({
        index: 0,
        routes: [{ name: "Start Screen" }],
      });
    } catch (error) {
      setError(error);
      setTimeout(() => {
        setError("");
      }, 500);
    }
  };
  return (
    <Background>
      <Logo />
      <Header>Movie Apps</Header>
      <Paragraph>By Ghiffary Rifqialdi</Paragraph>
      <Paragraph>Thank you for using this apps!</Paragraph>
      <Button mode="outlined" onPress={() => onLogoutPressed()}>
        Logout
      </Button>
      {error && (
        <Animated.View
          exiting={FadeOut}
          style={{
            position: "absolute",
            zIndex: 100,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <MaterialIcons name="error" size={100} color="black" />
          <Text>{error.message}</Text>
        </Animated.View>
      )}
    </Background>
  );
}
