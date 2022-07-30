import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LOCATIONS } from "../data/dummy-data";
import { useState, useEffect } from "react";
import { fetchLocation } from "../util/http";

function LocationDetailsScreen({ route }) {
  const locationId = route.params.locationId;
  const [fetchedLocation, setFetchedLocation] = useState([]);
  useEffect(() => {
    async function getLocation(locationId) {
      const location = await fetchLocation(locationId);
      setFetchedLocation(location);
    }
    getLocation(locationId);
  }, []);
  console.log(fetchedLocation);
  const name = fetchedLocation.name;
  const address = fetchedLocation.address;
  const images = fetchedLocation.images;
  const type = fetchedLocation.type;
  const style = fetchedLocation.style;
  const buildDate = new Date(fetchedLocation.buildDate * 1000);
  const buildDateStr = buildDate.toString().slice(0, 15);
  const architects = fetchedLocation.architect;
  const description = fetchedLocation.description;

  return (
    <ScrollView style={styles.rootContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.typeView}>
          <Ionicons name="home-outline" size={30} />
        </View>
        <View style={styles.nameAddressView}>
          <Text style={styles.nameView}>{name}</Text>
          <Text style={styles.addressView}>{address}</Text>
        </View>
      </View>
      {images.map((image, imageIndex) => {
        return (
          <View key={imageIndex}>
            <Image style={styles.image} source={{ uri: image.uri }} />
          </View>
        );
      })}
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Type</Text>
        <Text style={styles.heading}>Style</Text>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.info}>{type}</Text>
        <Text style={styles.info}>{style}</Text>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Build Date</Text>
        <Text style={styles.heading}>Architect</Text>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.info}>{buildDateStr}</Text>
        <View style={styles.listView}>
          {architects.map((architect, index) => {
            return (
              <Text style={styles.info} key={index}>
                {architect.name}
              </Text>
            );
          })}
        </View>
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.descriptionView}>
          <Text style={styles.heading}>Description</Text>
          <Text>{description}</Text>
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
    fontSize: 18,
    flexDirection: "row",
  },
  image: {
    width: "100%",
    height: 300,
  },
  heading: {
    fontWeight: "bold",
    flex: 0.5,
  },
  info: {
    flex: 0.5,
  },
  listView: {
    flexDirection: "column",
    flex: 0.5,
  },
  descriptionView: {
    flexDirection: "column",
  },
});
