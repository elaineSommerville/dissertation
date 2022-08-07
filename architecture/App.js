import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/SignUpScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import DiscoveryScreen from "./screens/DiscoveryScreen";
import SignInScreen from "./screens/SignInScreen";
import LocationDetailsScreen from "./screens/LocationDetailsScreen";
import ImageScreen from "./screens/ImageScreen";
import VideoScreen from "./screens/VideoScreen";
import LocationPicker from "./screens/LocationPicker";
import Map from "./screens/Map";
import StoryScreen from "./screens/StoryScreen";

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
          name="locationDetails"
          component={LocationDetailsScreen}
          options={{
            title: "Location Details",
          }}
        />
        <Stack.Screen
          name="discovery"
          component={DiscoveryScreen}
          options={{
            title: "Discovery",
          }}
        />
        <Stack.Screen
          name="imageScreen"
          component={ImageScreen}
          options={{
            title: "Image",
          }}
        />
        <Stack.Screen
          name="videoScreen"
          component={VideoScreen}
          options={{
            title: "Video",
          }}
        />
        <Stack.Screen
          name="storyScreen"
          component={StoryScreen}
          options={{
            title: "Story",
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
          name="locationPicker"
          component={LocationPicker}
          options={{
            title: "Location Picker",
          }}
        />
        <Stack.Screen
          name="map"
          component={Map}
          options={{
            title: "Map",
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
