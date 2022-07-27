import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

function SignInScreen({ navigation }) {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.topContainer}>
        <Image
          style={styles.image}
          source={require("../assets/images/place.png")}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.textTitleBox}>Email Address</Text>

        <TextInput
          style={styles.textInputBox}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.textTitleBox}>Password</Text>

        <TextInput
          style={styles.textInputBox}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
        <PrimaryButton title="Sign-in" />
      </View>
    </View>
  );
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
