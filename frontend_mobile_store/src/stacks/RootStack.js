import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "../screens/StartScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
// import MainMenuTab from "../tabs/MainMenuTab";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

export default function RootStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Start Screen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Start Screen" component={StartScreen} />
      <Stack.Screen name="Login Screen" component={LoginScreen} />
      <Stack.Screen name="Register Screen" component={RegisterScreen} />
      {/* <Stack.Screen name="Main Menu Tab" component={MainMenuTab} /> */}
      <Stack.Screen
        name="Reset Password Screen"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
}
