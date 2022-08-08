import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { fetchLocation } from "../util/http";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";
import Carousel from "react-native-snap-carousel";

import { SliderBox } from "react-native-image-slider-box";
// npm install react-native-image-slider-box
// https://www.npmjs.com/package/react-native-image-slider-box
// replace ViewPropTypes in multiple places
// import {ViewPropTypes} from 'deprecated-react-native-prop-types';
// ./node_modules/react-native-snap-carousel/src/carousel/Carousel.js
// ./node_modules/react-native-snap-carousel/src/pagination/Pagination.js
// ./node_modules/react-native-snap-carousel/src/pagination/PaginationDot.js
// ./node_modules/react-native-snap-carousel/src/parallaximage/ParallaxImage.js

export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

function LocationDetailsScreen({ route, navigation }) {
  const locationId = route.params.locationId;
  const [fetchedLocation, setFetchedLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);

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
  const videos = fetchedLocation.videos;
  const stories = fetchedLocation.stories;
  const type = fetchedLocation.type;
  const style = fetchedLocation.style;
  const buildDate = new Date(fetchedLocation.buildDate * 1000);
  const buildDateStr = buildDate.toString().slice(0, 15);
  const architects = fetchedLocation.architect;
  const description = fetchedLocation.description;
  const visitorInfo = fetchedLocation.visitorInfo;
  const openToPublic = fetchedLocation.openToPublic;

  const imageUris = [];
  const imageCaptions = [];

  const videoUris = [];
  const videoCaptions = [];
  const videoThumbnails = [];

  function renderVisitorInfo(visitorInfo, openToPublic) {
    if (!openToPublic) {
      return <Text>This building is not open to the public.</Text>;
    } else {
      if (visitorInfo == null) {
        return (
          <Text>
            This building is open to the public, but we don't have any visitor
            information for this building.
          </Text>
        );
      }
      return (
        <View>
          <View style={styles.visitorInfoRow}>
            <Ionicons name="call-outline" size={25} />
            <Text style={styles.visitorInfoText}>{visitorInfo.phone}</Text>
          </View>
          <View style={styles.visitorInfoRow}>
            <Ionicons name="globe-outline" size={25} />
            <Text style={styles.visitorInfoText}>{visitorInfo.uri}</Text>
          </View>
          <View style={styles.visitorInfoRow}>
            <Ionicons name="mail-outline" size={25} />
            <Text style={styles.visitorInfoText}>{visitorInfo.email}</Text>
          </View>
        </View>
      );
    }
  }

  function errorHandler() {
    navigation.goBack();
  }

  function Story({ item, index }) {
    // const navigation = useNavigation();
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("storyScreen", {
            story: item,
          })
        }
      >
        <View style={styles.storyCard} key={index}>
          <Image style={styles.storyImage} source={{ uri: item.image }} />
          <Text style={styles.storyTitle}>{item.title}</Text>
          <Text style={styles.storySubtitle}>{item.subtitle}</Text>
        </View>
      </Pressable>
    );
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
    videos.map((video) => {
      videoUris.push(video.uri);
      videoCaptions.push(video.name);
      videoThumbnails.push(video.thumbnail);
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
        <View style={styles.innerContainer}>
          <View style={styles.descriptionView}>
            <Text style={styles.heading}>Visitor Information</Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.descriptionView}>
            {renderVisitorInfo(visitorInfo, openToPublic)}
            {/* {renderOpeningTimes(visitorInfo)} */}
            <View style={styles.headerRow}>
              <Ionicons name="time-outline" size={25} />
              <Text style={styles.heading}>Opening Hours</Text>
            </View>
            {visitorInfo.openingTimes.map((item, key) => {
              if (item.status === "open") {
                return (
                  <View key={key}>
                    <Text>
                      <Ionicons name="lock-open-outline" size={25} />
                      {item.day[0].toUpperCase() + item.day.substring(1)}
                      {item.openFrom} - {item.closeAt}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <View key={key}>
                    <Text>
                      <Ionicons name="lock-closed-outline" size={25} />
                      {item.day[0].toUpperCase() + item.day.substring(1)} Closed
                    </Text>
                  </View>
                );
              }
            })}
            {/* this ois the start of the admission fees stuff */}
            <View style={styles.headerRow}>
              <Ionicons name="cash-outline" size={25} />
              <Text style={styles.heading}>Admission Fees</Text>
            </View>
            {visitorInfo.admissionFees.map((item, key) => {
              return (
                <View key={key}>
                  <Text>
                    {item.feeName[0].toUpperCase() + item.feeName.substring(1)}
                    {"    "}£{item.feeAmount.toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.headerRow}>
          <Ionicons name="film-outline" size={25} />
          <Text style={styles.heading}>Videos</Text>
        </View>
        <SliderBox
          images={videoThumbnails}
          sliderBoxHeight={200}
          onCurrentImagePressed={(index) =>
            navigation.navigate("videoScreen", {
              uri: videoUris[index],
              caption: videoCaptions[index],
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
        <View style={styles.headerRow}>
          <Ionicons name="book-outline" size={25} />
          <Text style={styles.heading}>Stories</Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Carousel
            layout={"default"}
            layoutCardOffset={0}
            ref={isCarousel}
            data={stories}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            renderItem={Story}
            useScrollView={true}
            onSnapToItem={(index) => setIndex(index)}
            autoplay={true}
            enableMomentum={false}
            lockScrollWhileSnapping={true}
          />
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
    justifyContent: "center",
  },
  visitorInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  visitorInfoText: {
    paddingLeft: 12,
  },
  headerRow: {
    flexDirection: "row",
    fontWeight: "bold",
  },
  storyCard: {
    backgroundColor: "white",
    borderRadius: 8,
    width: ITEM_WIDTH,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  storyImage: {
    width: ITEM_WIDTH,
    height: 200,
  },
  storyTitle: {
    color: "#222",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  storySubtitle: {
    color: "#222",
    fontSize: 14,
    paddingHorizontal: 20,
  },
});
