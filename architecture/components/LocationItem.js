import { View, Image, Text, Pressable, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

function LocationItem({ id, name, address, distance, type, onPress }) {
  const markerImages = {
    university: require("../assets/icons/map-pin-university.png"),
    education: require("../assets/icons/map-pin-generic.png"),
    library: require("../assets/icons/map-pin-library.png"),
    residential: require("../assets/icons/map-pin-residential.png"),
    commercial: require("../assets/icons/map-pin-generic.png"),
    industrial: require("../assets/icons/map-pin-industrial.png"),
  };
  return (
    <View style={styles.viewContainer} key={id}>
      <Pressable onPress={onPress}>
        <View style={styles.innerContainer}>
          <View style={styles.iconDistanceView}>
            {/* <Ionicons name="home-outline" size={30} /> */}
            <Image
              source={markerImages[type.toLowerCase()]}
              style={styles.locationIcon}
            />
            <Text>{distance} mi</Text>
          </View>
          <View style={styles.nameAddressView}>
            <Text style={styles.nameView}>{name}</Text>
            <Text style={styles.typeView}>{type}</Text>
            <Text style={styles.addressView}>{address}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default LocationItem;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "white",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  nameView: {
    fontWeight: "bold",
  },
  addressView: {
    color: "#888",
  },
  textInput: {
    width: "100%",
    height: 35,
    fontSize: 18,
    flex: 1,
  },
  iconDistanceView: {
    width: 75,
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center",
  },
  nameAddressView: {
    flex: 0.85,
    alignItems: "flex-start",
    paddingLeft: 6,
  },
  innerContainer: {
    flexDirection: "row",
  },
  locationItem: {
    width: 25,
    height: 25,
  },
});
