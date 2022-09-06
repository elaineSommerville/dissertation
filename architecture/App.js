import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import AddContent from "./screens/AddContent";
import IconButton from "./components/ui/IconButton";
import Profile from "./screens/Profile";

const Stack = createNativeStackNavigator();

function AuthStack() {
  const authCtx = useContext(AuthContext);
  console.log("authctx");
  console.log(authCtx.isAuthenticated);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "red" },
        headerTitleStyle: { fontWeight: "bold" },
        headerTintColor: "white",
        contentStyle: { backgroundColor: "white" },
      }}
    >
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
        name="search"
        component={Search}
        options={{
          title: "Search",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="map"
        component={Map}
        options={({ navigation }) => ({
          title: "Map",
          headerRight: () => {
            return (
              <Button
                title="Sign In"
                color="white"
                onPress={() => navigation.navigate("onboarding")}
              />
            );
          },
        })}
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
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  console.log("authctx");
  console.log(authCtx.isAuthenticated);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "red" },
        headerTitleStyle: { fontWeight: "bold" },
        headerTintColor: "white",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="map"
        component={Map}
        options={({ navigation }) => ({
          title: "Map",
          headerRight: () => {
            return (
              <IconButton
                icon="person"
                color="white"
                size={24}
                onPress={() => navigation.replace("profile", { parent: "map" })}
              />
            );
          },
        })}
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
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{
          title: "Profile",
          headerRight: () => {
            return (
              <IconButton
                icon="exit"
                color="white"
                size={24}
                onPress={authCtx.logout}
              />
            );
          },
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
