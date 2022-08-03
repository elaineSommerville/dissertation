import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { fetchLocation } from "../util/http";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";

import { SliderBox } from "react-native-image-slider-box";
// npm install react-native-image-slider-box
// https://www.npmjs.com/package/react-native-image-slider-box
// replace ViewPropTypes in multiple places
// import {ViewPropTypes} from 'deprecated-react-native-prop-types';
// ./node_modules/react-native-snap-carousel/src/carousel/Carousel.js
// ./node_modules/react-native-snap-carousel/src/pagination/Pagination.js
// ./node_modules/react-native-snap-carousel/src/pagination/PaginationDot.js
// ./node_modules/react-native-snap-carousel/src/parallaximage/ParallaxImage.js

function LocationDetailsScreen({ route, navigation }) {
  const locationId = route.params.locationId;
  const [fetchedLocation, setFetchedLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  console.log(route.params.locationId);

  useEffect(() => {
    async function getLocation(locationId) {
      try {
        const location = await fetchLocation(locationId);
        setFetchedLocation(location);
      } catch (error) {
        setError("Could not fetch location details...");
      }
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
  const imageCaptions = [];

  function errorHandler() {
    navigation.goBack();
  }

  if (error && !isLoading) {
    return (
      <ErrorOverlay
        buttonTitle="Go back"
        message={error}
        onConfirm={errorHandler}
      />
    );
  }

  if (isLoading) {
    return <LoadingOverlay />;
  } else {
    // once location data has been received, push images into imageUri array
    // for image slider
    images.map((image) => {
      imageUris.push(image.uri);
      imageCaptions.push(image.name);
    });
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
        <SliderBox
          images={imageUris}
          sliderBoxHeight={200}
          onCurrentImagePressed={(index) =>
            navigation.navigate("imageScreen", {
              uri: imageUris[index],
              caption: imageCaptions[index],
            })
          }
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          paginationBoxVerticalPadding={0}
          autoplay
          circleLoop
          resizeMethod={"resize"}
          resizeMode={"cover"}
          paginationBoxStyle={{
            position: "absolute",
            bottom: 0,
            paddingLeft: 0,
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "flex-start",
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
          ImageComponentStyle={{
            borderRadius: 10,
            width: "87%",
            marginTop: 5,
            marginLeft: -50,
          }}
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
