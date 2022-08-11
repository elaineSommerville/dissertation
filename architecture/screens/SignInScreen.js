import { Alert, StyleSheet } from "react-native";
import { useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AuthContent from "../components/Auth/AuthContent";
import { signIn } from "../util/auth";

function SignInScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function signInHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert(
        "Authentication failed",
        "Could not log you in, please try again."
      );
    }

    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Signing in..." />;
  }
  return <AuthContent isSignin onAuthenticate={signInHandler} />;
}
export default SignInScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  topContainer: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    marginTop: 75,
  },
  bottomContainer: {
    marginHorizontal: 75,
    height: "50%",
  },
  image: {
    width: 300,
    height: "80%",
  },
  textInputBox: {
    borderColor: "red",
    borderWidth: 1,
    marginVertical: 12,
    padding: 8,
    fontSize: 18,
    borderRadius: 8,
  },
  textTitleBox: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
