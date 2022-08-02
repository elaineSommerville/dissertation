import { View, StyleSheet, Alert, Image, Text } from "react-native";
import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { getMapPreview } from "../util/location";
// expo install expo-location
// npm install react-native-dotenv
// in babelrc add:
// "plugins": [
//   ["module:react-native-dotenv"]
// ]

function LocationPicker() {
  const [pickedLocation, setPickedLocation] = useState();
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this feature."
      );
      return false;
    }
    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync({});
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  function pickOnMapHandler() {}

  let locationPreview = <Text>No located picked yet.</Text>;

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    );
  }
  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <PrimaryButton title="Locate User" onPress={getLocationHandler} />
        <PrimaryButton title="Pick on Map" onPress={pickOnMapHandler} />
      </View>
    </View>
  );
}
export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    marginVertical: 8,
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
