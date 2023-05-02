import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function BackButton({ goBack, styles }) {
  return (
    <TouchableOpacity onPress={goBack} style={styles}>
      <MaterialIcons name="navigate-before" size={24} color="black" />
    </TouchableOpacity>
  );
}
