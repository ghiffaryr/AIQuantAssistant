import React, { useEffect } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { useSelector } from "react-redux";

export default function StartScreen({ navigation }) {
  const loggedIn = useSelector((state) => state.loggedIn);

  useEffect(() => {
    if (loggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Main Menu Tab" }],
      });
    }
  }, []);

  return (
    <Background>
      <Logo />
      <Header>Movie Apps</Header>
      <Paragraph>Please login first to access the application.</Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Login Screen")}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Register Screen")}
      >
        Sign Up
      </Button>
    </Background>
  );
}
