// expo MapView
// expo install react-native-maps
import MapView, { Callout, Marker } from "react-native-maps";
import { Alert, StyleSheet, View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { fetchLocations } from "../util/http";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";

function Map({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState();
  const [isLocationsLoading, setIsLocationsLoading] = useState(true);
  const [isUserLocationLoading, setIsUserLocationLoading] = useState(true);
  const [error, setError] = useState();
  const [fetchedLocations, setFetchedLocations] = useState([]);
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const [region, setRegion] = useState();

  // ***** END SET INITIAL MAP POSITION *****

  // ***** START GET LIST OF LOCATIONS *****
  useEffect(() => {
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

    async function getUserLocation() {
      try {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
          return;
        }
        const location = await getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude, // center
          longitude: location.coords.longitude, // center
          latitudeDelta: 0.05, // essentially configures the zoom
          longitudeDelta: 0.05, // essentially configures the zoom
        });
      } catch (error) {
        setError(error.message);
        setError(null);
      }
      setIsUserLocationLoading(false);
    }

    async function getLocations() {
      try {
        const locations = await fetchLocations();
        setFetchedLocations(locations);
      } catch (error) {
        setError(error.message);
      }
      setIsLocationsLoading(false);
    }
    getLocations();
    getUserLocation();
    console.log("STATE: region");
    console.log(region);
  }, [locationPermissionInformation]);
  // ***** END GET LIST OF LOCATIONS *****

  function selectLocationHandler(event) {
    console.log(event);
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setSelectedLocation({ lat: lat, lng: lng });
  }

  // ***** START SAVE LOCATION MARKERS *****

  // function savePickedLocationHandler() {
  //   if (!selectedLocation) {
  //     Alert.alert(
  //       "No location picked!",
  //       "You have to pick a location by tapping on the map first"
  //     );
  //     return;
  //   }
  //   navigation.navigate("LocationPicker", {
  //     pickedLat: selectedLocation.lat,
  //     pickedLng: selectedLocation.lng,
  //   });
  // }
  // Left out remainder of video 205 (from 3:40) which adds picked locations as I'm
  // not looking to add locations from the app yet.

  // ***** END SAVE LOCATION MARKERS *****

  function onMarkerPressHandler(locationId) {
    navigation.navigate("locationDetails", { locationId: locationId });
  }

  function createMarkers() {
    const displayedLocations = fetchedLocations.filter((locationItem) => {
      return locationItem;
    });
    const markerImages = {
      // TO DO: CREATE UNIVERSITY ICON
      university: require("../assets/icons/map-pin-university.png"),
      education: require("../assets/icons/map-pin-university.png"),
      library: require("../assets/icons/map-pin-library.png"),
    };
    return displayedLocations.map((location) => {
      return (
        <Marker
          key={location._id}
          title={location.name}
          image={markerImages[location.type.toLowerCase()]}
          description={
            location.type +
            " - Built: " +
            new Date(location.buildDate * 1000).toString().slice(11, 15)
          }
          coordinate={{
            latitude: location.lat,
            longitude: location.long,
          }}
          // have to stop the event propagating to allow it to distinguish between
          // pressing the marker for a label to pop up and actually getting to the
          // location details page
          onPress={(e) => {
            e.stopPropagation();
            onMarkerPressHandler(location._id);
          }}
        >
          {/* <Callout tooltip>
            <Text>{location.name}</Text>
          </Callout> */}
          <View>
            <Text style={styles.iconName}>{location.name}</Text>
          </View>
        </Marker>
      );
    });
  }
  if (isLocationsLoading && isUserLocationLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <MapView
        showsUserLocation
        showsMyLocationButton
        initialRegion={region}
        style={styles.map}
        // onPress={selectLocationHandler}
      >
        {createMarkers()}
      </MapView>
    );
  }
}

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  iconName: {
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1.5,
    elevation: 4,
    color: "#fff",
    marginLeft: 50,
    marginTop: 12,
  },
});
