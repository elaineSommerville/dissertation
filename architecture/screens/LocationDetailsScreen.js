import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LOCATIONS } from "../data/dummy-data";

function LocationDetailsScreen({ route }) {
  const locationId = route.params.locationId;
  const selectedLocation = LOCATIONS.find(
    (location) => location.id === locationId
  );
  return (
    <ScrollView style={styles.rootContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.typeView}>
          <Ionicons name="home-outline" size={30} />
        </View>
        <View style={styles.nameAddressView}>
          <Text style={styles.nameView}>{selectedLocation.name}</Text>
          <Text style={styles.addressView}>{selectedLocation.address}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
export default LocationDetailsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginBottom: 32,
    marginHorizontal: 25,
  },
  nameView: {
    fontWeight: "bold",
  },
  addressView: {
    color: "#888",
  },
  typeView: {
    width: 75,
    flex: 0.15,
  },
  nameAddressView: {
    flex: 0.85,
    alignItems: "flex-start",
  },
  innerContainer: {
    flexDirection: "row",
  },
});
