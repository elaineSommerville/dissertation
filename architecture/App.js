import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/SignUpScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import SignInScreen from "./screens/SignInScreen";
import LocationDetailsScreen from "./screens/LocationDetailsScreen";
import ImageScreen from "./screens/ImageScreen";
import VideoScreen from "./screens/VideoScreen";
import Map from "./screens/Map";
import Search from "./screens/Search";
import StoryScreen from "./screens/StoryScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import IconButton from "./components/ui/IconButton";
import AddContent from "./screens/AddContent";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
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
        name="map"
        component={Map}
        options={{
          title: "Map",
        }}
      />
      <Stack.Screen
        name="search"
        component={Search}
        options={{
          title: "Search",
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="map"
        component={Map}
        options={{
          title: "Map",
        }}
      />
      <Stack.Screen
        name="welcome"
        component={WelcomeScreen}
        options={{
          headerRight: () => (
            <IconButton
              icon="exit-outline"
              color="black"
              size={24}
              onPress={authCtx.logout}
            />
          ),
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
        name="search"
        component={Search}
        options={{
          title: "Search",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="addContent"
        component={AddContent}
        options={{
          title: "Contribute",
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }
      setIsTryingLogin(false);
    }
    fetchToken();
  }, []);
  if (isTryingLogin) {
    SplashScreen.preventAutoHideAsync();
  }
  SplashScreen.hideAsync();
  return <Navigation />;
}

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
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
