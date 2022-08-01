import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { fetchLocation } from "../util/http";
import { SliderBox } from "react-native-image-slider-box";

// npm install react-native-image-slider-box
// https://www.npmjs.com/package/react-native-image-slider-box
// replace ViewPropTypes in multiple places
// import {ViewPropTypes} from 'deprecated-react-native-prop-types';
// ./node_modules/react-native-snap-carousel/src/carousel/Carousel.js
// ./node_modules/react-native-snap-carousel/src/pagination/Pagination.js
// ./node_modules/react-native-snap-carousel/src/pagination/PaginationDot.js
// ./node_modules/react-native-snap-carousel/src/parallaximage/ParallaxImage.js

function LocationDetailsScreen({ route }) {
  const locationId = route.params.locationId;
  const [fetchedLocation, setFetchedLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getLocation(locationId) {
      const location = await fetchLocation(locationId);
      setFetchedLocation(location);
      setIsLoading(false);
    }
    getLocation(locationId);
  }, []);

  const name = fetchedLocation.name;
  const address = fetchedLocation.address;
  const images = fetchedLocation.images;
  const type = fetchedLocation.type;
  const style = fetchedLocation.style;
  const buildDate = new Date(fetchedLocation.buildDate * 1000);
  const buildDateStr = buildDate.toString().slice(0, 15);
  const architects = fetchedLocation.architect;
  const description = fetchedLocation.description;

  const imageUris = [];

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
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
        {images.map((image) => {
          imageUris.push(image.uri);
        })}
        <SliderBox
          images={imageUris}
          sliderBoxHeight={200}
          onCurrentImagePressed={(index) =>
            console.warn(`image ${index} pressed`)
          }
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          paginationBoxVerticalPadding={20}
          autoplay
          circleLoop
          resizeMethod={"resize"}
          resizeMode={"cover"}
          paginationBoxStyle={{
            position: "absolute",
            bottom: 0,
            padding: 0,
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            paddingVertical: 0,
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            padding: 0,
            margin: 0,
            marginBottom: 10,
            backgroundColor: "rgba(128, 128, 128, 0.92)",
          }}
          ImageComponentStyle={{ borderRadius: 15, width: "97%", marginTop: 5 }}
          imageLoadingColor="#2196F3"
        />
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
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContents: "center",
  },
});
