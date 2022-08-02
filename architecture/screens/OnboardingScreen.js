import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.topContainer}>
        <Image
          style={styles.image}
          source={require("../assets/images/place.png")}
        />
      </View>
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="Sign-in"
          onPress={() => navigation.navigate("signIn")}
        />
        <PrimaryButton
          title="Sign-up"
          onPress={() => navigation.navigate("signUp")}
        />
        <PrimaryButton
          title="Continue as Guest"
          onPress={() => navigation.navigate("discovery")}
        />
        <PrimaryButton
          title="Location Picker"
          onPress={() => navigation.navigate("locationPicker")}
        />
      </View>
    </View>
  );
}
export default OnboardingScreen;

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
    height: "50%",
    marginHorizontal: 75,
  },
  image: {
    width: 300,
    height: "80%",
  },
});
