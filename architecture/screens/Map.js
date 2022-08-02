// expo MapView
// expo install react-native-maps
import MapView, { Marker } from "react-native-maps";
import { Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

function Map() {
  const [selectedLocation, setSelectedLocation] = useState();

  const region = {
    latitude: 37.78, // center
    longitude: -122.43, // center
    latitudeDelta: 0.0922, // essentially configures the zoom
    longitudeDelta: 0.0421, // essentially configures the zoom
  };

  function selectLocationHandler(event) {
    console.log(event);
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setSelectedLocation({ lat: lat, lng: lng });
  }

  function savePickedLocationHandler() {
    if (!selectedLocation) {
      Alert.alert(
        "No location picked!",
        "You have to pick a location by tapping on the map first"
      );
      return;
    }
    navigation.navigate("LocationPicker", {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
    });
  }
  // Left out remainder of video 205 (from 3:40) which adds picked locations as I'm
  // not looking to add locations from the app yet.
  return (
    <MapView
      initialRegion={region}
      style={styles.map}
      onPress={selectLocationHandler}
    >
      {
        // only render a marker if the selectedLocation is not empty,
        // otherwise you get an error
        selectedLocation && (
          <Marker
            title="Picked Location"
            coordinate={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lng,
            }}
          />
        )
      }
    </MapView>
  );
}

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
