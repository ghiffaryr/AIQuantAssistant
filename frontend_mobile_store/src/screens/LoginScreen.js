import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { IP } from "../env/Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeOut } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      let { status, data } = await axios.post(`${IP}/login`, {
        email: email.value,
        password: password.value,
      });
      await AsyncStorage.setItem("user_email", data.email);
      await AsyncStorage.setItem("user_name", data.name);
      await AsyncStorage.setItem("user_role", data.role);
      await AsyncStorage.setItem("user_token", data.token);
      await AsyncStorage.setItem("token_type", data.type);
      dispatch({ type: "loggedIn" });
      setError("");

      navigation.reset({
        index: 0,
        routes: [{ name: "Main Menu Tab" }],
      });
    } catch (error) {
      if (error.response.status === 401) {
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        setError(
          "The email or the password are incorrect! \nPlease try again."
        );
        setTimeout(() => {
          setError("");
        }, 1000);
      } else {
        setError("An error has occured!");
        setTimeout(() => {
          setError("");
        }, 1000);
      }
    }
  };

  return (
    <Background>
      <View style={styles.header}>
        <BackButton goBack={() => navigation.goBack()} />
      </View>
      <View style={styles.content}>
        <Logo />
        <Header>Welcome back!</Header>
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Reset Password Screen")}
          >
            <Text style={styles.forgot}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
        <Button mode="contained" onPress={onLoginPressed}>
          Login
        </Button>
        <View style={styles.row}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.replace("Register Screen")}
          >
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
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
              borderColor: theme.colors.primary,
              borderWidth: 1,
            }}
          >
            <MaterialIcons name="error" size={100} color="black" />
            <Text style={{ textAlign: "center" }}>{error}</Text>
          </Animated.View>
        )}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    top: getStatusBarHeight(),
    alignSelf: "flex-start",
  },
  content: {
    flex: 1,
    top: getStatusBarHeight(),
    width: "100%",
    paddingBottom: 20 + getStatusBarHeight(),
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
