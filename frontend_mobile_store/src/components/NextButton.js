import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function NextButton({ goNext, styles }) {
  return (
    <TouchableOpacity onPress={goNext} style={styles}>
      <MaterialIcons name="navigate-next" size={24} color="black" />
    </TouchableOpacity>
  );
}
