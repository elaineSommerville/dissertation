import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/SignUpScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import DiscoveryScreen from "./screens/DiscoveryScreen";
import SignInScreen from "./screens/SignInScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signIn"
          component={SignInScreen}
          options={{
            title: "Sign In",
          }}
        />
        <Stack.Screen
          name="signUp"
          component={SignUpScreen}
          options={{
            title: "Sign Up",
          }}
        />

        <Stack.Screen
          name="discovery"
          component={DiscoveryScreen}
          options={{
            title: "Discovery",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
