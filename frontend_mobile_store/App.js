import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { theme } from "./src/core/theme";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/stacks/RootStack";
import store from "./src/store/store";

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
}
