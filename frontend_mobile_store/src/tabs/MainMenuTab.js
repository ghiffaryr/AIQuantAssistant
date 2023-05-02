import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { theme } from "../core/theme";

export default function MainMenuTab() {
  const Tab = createBottomTabNavigator();

  return <Tab.Navigator></Tab.Navigator>;
}
