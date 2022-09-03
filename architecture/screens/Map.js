// expo MapView
// expo install react-native-maps
import MapView, { Callout, Marker } from "react-native-maps";
import { Alert, StyleSheet, View, Text, Button } from "react-native";
import { useState, useEffect, useLayoutEffect, useContext } from "react";
import { fetchLocationsHeadersWithinMap } from "../util/http";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { AuthContext } from "../store/auth-context";

function Map({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [selectedLocation, setSelectedLocation] = useState();
  const [userLocation, setUserLocation] = useState();
  const [isLocationsLoading, setIsLocationsLoading] = useState(true);
  const [isUserLocationLoading, setIsUserLocationLoading] = useState(true);
  const [error, setError] = useState();
  const [
    fetchedLocationsHeadersWithinMap,
    setFetchedLocationsHeadersWithinMap,
  ] = useState([]);
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const [region, setRegion] = useState({
    latitude: 54.59803, // center
    longitude: -5.93049, // center
    latitudeDelta: 0.05, // essentially configures the zoom
    longitudeDelta: 0.05, // essentially configures the zoom
  });
  //  ***** START ADD SEARCH ICON *****
  useLayoutEffect(() => {
    let searchLat = 54.59803;
    let searchLng = -5.93049;
    if (!isUserLocationLoading) {
      // if user location has loaded, pass user's location to search
      searchLat = userLocation.coords.latitude;
      searchLng = userLocation.coords.longitude;
    }
    navigation.setOptions({
      headerLeft: () => {
        return (
          <Button
            onPress={() =>
              navigation.navigate("search", {
                latitude: searchLat,
                longitude: searchLng,
              })
            }
            title="Search"
          />
        );
      },
      headerRight: () => {
        return <Button onPress={authCtx.logout} title="Sign out" />;
      },
    });
  }, [userLocation]);
  // ***** END ADD SEARCH ICON *****

  // ***** START GET LOCATION PERMISSIONS *****
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
        setUserLocation(location);
      } catch (error) {
        setError(error.message);
        setError(null);
      }
      setIsUserLocationLoading(false);
    }
    getUserLocation();
  }, [locationPermissionInformation]);
  // ***** END GET LOCATION PERMISSIONS *****

  // ***** START GET LOCATIONS *****
  useEffect(() => {
    async function getLocationsHeaders(region) {
      setIsLocationsLoading(true);
      try {
        const locationsWithinMap = await fetchLocationsHeadersWithinMap(region);
        setFetchedLocationsHeadersWithinMap(locationsWithinMap.data);
      } catch (error) {
        setError(error.message);
      }
      setIsLocationsLoading(false);
    }

    getLocationsHeaders(region);
  }, [region]);
  // ***** END GET LOCATIONS *****

  function onMarkerPressHandler(locationId) {
    navigation.navigate("locationDetails", { locationId: locationId });
  }

  function createMarkers() {
    const markerImages = {
      // TO DO: CREATE UNIVERSITY ICON
      university: require("../assets/icons/map-pin-university.png"),
      education: require("../assets/icons/map-pin-generic.png"),
      library: require("../assets/icons/map-pin-library.png"),
      residential: require("../assets/icons/map-pin-generic.png"),
      commercial: require("../assets/icons/map-pin-generic.png"),
      industrial: require("../assets/icons/map-pin-generic.png"),
    };

    return fetchedLocationsHeadersWithinMap.map((location) => {
      // console.log("fetchedLocationsHeadersWithinMap: ");
      // console.log(fetchedLocationsHeadersWithinMap);
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
            latitude: location.location.coordinates[1],
            longitude: location.location.coordinates[0],
          }}
          // have to stop the event propagating to allow it to distinguish between
          // pressing the marker for a label to pop up and actually getting to the
          // location details page
          onPress={(e) => {
            e.stopPropagation();
            onMarkerPressHandler(location._id);
          }}
        >
          <View>
            <Text style={styles.iconName}>{location.name}</Text>
          </View>
        </Marker>
      );
    });
  }

  if (isLocationsLoading && isUserLocationLoading) {
    return (
      <View style={styles.rootContainer}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    console.log(userLocation);
    return (
      <MapView
        showsUserLocation
        showsMyLocationButton
        initialRegion={region}
        style={styles.map}
        onRegionChangeComplete={(Region) => {
          if (
            Region.latitude.toFixed(6) === region.latitude.toFixed(6) &&
            Region.longitude.toFixed(6) === region.longitude.toFixed(6)
          ) {
            return;
          }
          setRegion(Region);
        }}
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
