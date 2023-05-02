import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
import { nameValidator } from "../helpers/nameValidator";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { IP } from "../env/Constants";
import Animated, { FadeOut } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      let { status, data } = await axios.post(`${IP}/register`, {
        name: name.value,
        email: email.value,
        password: password.value,
      });

      setSuccess("Successfully registered!");
      setError("");

      setTimeout(() => {
        setSuccess("");
        navigation.navigate("Login Screen");
      }, 500);
    } catch (error) {
      if (error.response.status === 409) {
        setSuccess("");
        setError(error.response.data["message"]);
        setTimeout(() => {
          setError("");
        }, 500);
      } else {
        setSuccess("");
        setError("An error has occured!");
        setTimeout(() => {
          setError("");
        }, 500);
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
        <Header>Create Account</Header>
        <TextInput
          label="Name"
          returnKeyType="next"
          value={name.value}
          onChangeText={(text) => setName({ value: text, error: "" })}
          error={!!name.error}
          errorText={name.error}
        />
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
        <Button
          mode="contained"
          onPress={onSignUpPressed}
          style={{ marginTop: 24 }}
        >
          Sign Up
        </Button>
        <View style={styles.row}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace("Login Screen")}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
        {success && (
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
            <MaterialIcons name="check" size={100} color="black" />
            <Text style={{ textAlign: "center" }}>{success}</Text>
          </Animated.View>
        )}
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
            <Text>{error}</Text>
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
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
