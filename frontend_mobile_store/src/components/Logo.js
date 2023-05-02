import React from "react";
import { Image, StyleSheet, Text } from "react-native";
import { theme } from "../core/theme";

export default function Logo() {
  return (
    <Image source={require("../assets/logo.jpg")} style={styles.image} />
    // <Text style={styles.text}>Mini iTunes</Text>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
  // text: {
  //   fontSize: 26,
  //   color: theme.colors.secondary,
  //   fontWeight: "bold",
  //   marginBottom: 8,
  // },
});
