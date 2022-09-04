import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Button,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState, useEffect, useRef } from "react";
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

import AuthContextProvider, { AuthContext } from "../store/auth-context";

export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

function LocationDetailsScreen({ route, navigation }) {
  const locationId = route.params.locationId;
  const [fetchedLocation, setFetchedLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);
  const [iconPath, setIconPath] = useState();

  useEffect(() => {
    async function getLocation(locationId) {
      try {
        const location = await fetchLocation(locationId);
        setFetchedLocation(location.data);
      } catch (error) {
        setError("Could not fetch location details...");
      }
      setIsLoading(false);
    }
    getLocation(locationId);
  }, []);

  const name = fetchedLocation.name;
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

  const authCtx = useContext(AuthContext);

  function renderVisitorInfo(visitorInfo, openToPublic) {
    if (!openToPublic) {
      return (
        <Text style={styles.info}>
          This building is not open to the public.
        </Text>
      );
    } else {
      if (
        visitorInfo == null ||
        (!("uri" in visitorInfo) &&
          !("phone" in visitorInfo) &&
          !("email" in visitorInfo))
      ) {
        return (
          <Text style={styles.info}>
            This building is open to the public, but we don't have any visitor
            information for this building.
          </Text>
        );
      }
      return (
        <View style={{ width: "100%" }}>
          {visitorInfo.phone && (
            <View style={styles.visitorInfoRow}>
              <View style={styles.visitorInfoIcon}>
                <Ionicons name="call-outline" size={25} />
              </View>
              <View style={styles.visitorInfoText}>
                <Text style={styles.visitorInfoText}>{visitorInfo.phone}</Text>
              </View>
            </View>
          )}
          {visitorInfo.uri && (
            <View style={styles.visitorInfoRow}>
              <View style={styles.visitorInfoIcon}>
                <Ionicons name="globe-outline" size={25} />
              </View>
              <View style={styles.visitorInfoText}>
                <Button
                  style={styles.visitorInfoTextButton}
                  onPress={() => Linking.openURL(visitorInfo.uri)}
                  title={visitorInfo.uri}
                />
              </View>
            </View>
          )}
          {visitorInfo.email && (
            <View style={styles.visitorInfoRow}>
              <View style={styles.visitorInfoIcon}>
                <Ionicons name="mail-outline" size={25} />
              </View>
              <View style={styles.visitorInfoText}>
                <Text style={styles.visitorInfoText}>{visitorInfo.email}</Text>
              </View>
            </View>
          )}
        </View>
      );
    }
  }

  function errorHandler() {
    navigation.goBack();
  }

  function Story({ item, index }) {
    let source = "data:image/jpeg;base64, ";
    if ("uri" in item) {
      source = item.uri;
    } else {
      source += item.imageData;
    }
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("storyScreen", {
            story: item,
          })
        }
      >
        <View style={styles.storyCard} key={index}>
          <Image style={styles.storyImage} source={{ uri: source }} />
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
    return (
      <AuthContextProvider>
        <LoadingOverlay />
      </AuthContextProvider>
    );
  } else {
    // once location data has been received, push images into imageUri array
    // for image slider

    "images" in fetchedLocation &&
      fetchedLocation.images != null &&
      images.map((image) => {
        if ("imageData" in image) {
          imageUris.push("data:image/jpeg;base64," + image.imageData);
          imageCaptions.push(image.name);
        } else {
          imageUris.push(image.uri);
          imageCaptions.push(image.name);
        }
      });
    "videos" in fetchedLocation &&
      fetchedLocation.videos != null &&
      videos.map((video) => {
        videoUris.push(video.uri);
        videoCaptions.push(video.name);
        videoThumbnails.push(video.thumbnail);
      });

    const markerImages = {
      // TO DO: CREATE UNIVERSITY ICON
      university: require("../assets/icons/map-pin-university.png"),
      education: require("../assets/icons/map-pin-generic.png"),
      library: require("../assets/icons/map-pin-library.png"),
      residential: require("../assets/icons/map-pin-generic.png"),
      commercial: require("../assets/icons/map-pin-generic.png"),
      industrial: require("../assets/icons/map-pin-generic.png"),
    };

    return (
      <AuthContextProvider>
        <ScrollView style={styles.rootContainer}>
          <View style={styles.rowView}>
            <View style={styles.typeView}>
              <Image
                source={markerImages[type.toLowerCase()]}
                style={styles.locationIcon}
              />
            </View>
            <View style={styles.nameAddressView}>
              <Text style={styles.nameView}>{name}</Text>
              <Text style={styles.addressView}>{visitorInfo.address}</Text>
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
          {authCtx.isAuthenticated && (
            <Button
              title="+ Add an image"
              onPress={() => {
                navigation.navigate("addContent", {
                  locationId: locationId,
                  contentType: "images",
                });
              }}
            />
          )}
          <View style={styles.rowView}>
            <Text style={styles.heading50}>Type</Text>
            <Text style={styles.heading50}>Style</Text>
          </View>
          <View style={styles.rowView}>
            <Text style={styles.info50}>{type}</Text>
            <Text style={styles.info50}>{style}</Text>
          </View>
          <View style={styles.rowView}>
            <Text style={styles.heading50}>Build Date</Text>
            <Text style={styles.heading50}>Architect</Text>
          </View>
          <View style={styles.rowView}>
            <Text style={styles.info50}>{buildDateStr}</Text>
            <View style={styles.listView}>
              {architects.map((architect, index) => {
                return (
                  <Text style={styles.info50} key={index}>
                    {architect.name}
                  </Text>
                );
              })}
            </View>
          </View>
          <View style={styles.rowView}>
            <View style={styles.columnView}>
              <Text style={styles.heading}>Description</Text>
              <Text style={styles.info}>{description}</Text>
            </View>
          </View>
          <View style={styles.rowView}>
            <View style={styles.columnView}>
              <Text style={styles.heading}>Visitor Information</Text>
            </View>
          </View>
          <View style={styles.rowView}>
            <View style={styles.columnView}>
              {renderVisitorInfo(visitorInfo, openToPublic)}
            </View>
          </View>
          <View style={styles.columnView}>
            {/* <View style={styles.headerRow}> */}
            {/* <View style={styles.openingHoursIcon}>
                  <Ionicons name="time-outline" size={25} />
                </View> */}
            <View>
              <Text style={styles.heading}>Opening Hours</Text>
            </View>
            {/* </View> */}
            {"openingTimes" in visitorInfo ? (
              visitorInfo.openingTimes.map((item, key) => {
                if (item.status === "open") {
                  return (
                    <View style={styles.openingHoursRow} key={key}>
                      <View style={styles.openingHoursIcon}>
                        {/* <Ionicons name="lock-open-outline" size={25} /> */}
                        <Ionicons name="checkmark" size={25} color="green" />
                      </View>
                      <View style={styles.openingHoursDay}>
                        <Text style={styles.openingHoursDay}>
                          {item.day[0].toUpperCase() + item.day.substring(1)}
                        </Text>
                      </View>
                      <View style={styles.openingHoursTimes}>
                        <Text style={styles.openingHoursTimes}>
                          {item.openFrom} - {item.closeAt}
                        </Text>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View style={styles.openingHoursRow} key={key}>
                      <View style={styles.openingHoursIcon}>
                        {/* <Ionicons name="lock-closed-outline" size={25} /> */}
                        <Ionicons name="close" size={25} color="#de1028" />
                      </View>
                      <View style={styles.openingHoursDay}>
                        <Text style={styles.openingHoursDay}>
                          {item.day[0].toUpperCase() + item.day.substring(1)}
                        </Text>
                      </View>
                      <View style={styles.openingHoursTimes}>
                        <Text style={styles.openingHoursTimes}>Closed</Text>
                      </View>
                    </View>
                  );
                }
              })
            ) : (
              <View>
                <Text style={styles.info}>No information available</Text>
              </View>
            )}
            {/* this ois the start of the admission fees stuff */}
            <View style={styles.headerRow}>
              {/* <Ionicons name="cash-outline" size={25} /> */}
              <Text style={styles.heading}>Admission Fees</Text>
            </View>
            {"admissionFees" in visitorInfo ? (
              visitorInfo.admissionFees.map((item, key) => {
                return (
                  <View style={styles.openingHoursRow} key={key}>
                    <View style={styles.openingHoursIcon}></View>
                    <View style={styles.openingHoursDay}>
                      <Text style={styles.openingHoursDay}>
                        {item.feeName[0].toUpperCase() +
                          item.feeName.substring(1)}
                      </Text>
                    </View>
                    <View style={styles.openingHoursTimes}>
                      <Text style={styles.openingHoursTimes}>
                        £{item.feeAmount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View>
                <Text style={styles.info}>No information available</Text>
              </View>
            )}
          </View>
          {/* </View> */}
          <View style={styles.headerRow}>
            {/* <Ionicons name="film-outline" size={25} /> */}
            <Text style={styles.heading}>Videos</Text>
          </View>
          {"videos" in fetchedLocation && fetchedLocation.videos != null ? (
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
          ) : (
            <Text style={styles.info}>No videos have been added yet.</Text>
          )}
          {authCtx.isAuthenticated && (
            <Button
              title="+ Add a video"
              onPress={() => {
                navigation.navigate("addContent", {
                  locationId: locationId,
                  contentType: "videos",
                });
              }}
            />
          )}
          <View style={styles.headerRow}>
            {/* <Ionicons name="book-outline" size={25} /> */}
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
          {authCtx.isAuthenticated && (
            <Button
              title="+ Add a story"
              onPress={() => {
                navigation.navigate("addContent", {
                  locationId: locationId,
                  contentType: "stories",
                });
              }}
            />
          )}
        </ScrollView>
      </AuthContextProvider>
    );
  }
}
export default LocationDetailsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    paddingHorizontal: 25,
    backgroundColor: "white",
    paddingTop: 10,
  },
  nameView: {
    // fontWeight: "bold",
    fontSize: 24,
    paddingVertical: 6,
    paddingLeft: 10,
  },
  addressView: {
    color: "#999",
    fontSize: 16,
    marginBottom: 6,
    paddingLeft: 10,
  },
  typeView: {
    width: 75,
    flex: 0.15,
    paddingTop: 12,
  },
  nameAddressView: {
    flex: 0.85,
    alignItems: "flex-start",
  },
  rowView: {
    fontSize: 18,
    flexDirection: "row",
  },
  image: {
    width: "100%",
    height: 300,
  },
  heading50: {
    fontWeight: "bold",
    flex: 0.5,
    fontSize: 16,
    paddingTop: 12,
  },
  info50: {
    flex: 0.5,
    paddingTop: 4,
    fontSize: 16,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 12,
    marginBottom: 6,
  },
  info: {
    paddingTop: 4,
    fontSize: 16,
  },
  openingHoursRow: {
    flexDirection: "row",
    flex: 1,
    paddingTop: 6,
    marginVertical: 2,
  },
  openingHoursIcon: {
    flex: 1,
  },
  openingHoursDay: {
    flex: 4,
    fontSize: 16,
  },
  openingHoursTimes: {
    flex: 4,
    fontSize: 16,
  },
  listView: {
    flexDirection: "column",
    flex: 0.5,
  },
  columnView: {
    flexDirection: "column",
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  visitorInfoRow: {
    flexDirection: "row",
    flex: 1,
    // alignItems: "center",
    paddingTop: 8,
  },
  visitorInfoIcon: {
    // flex: 1,
    // backgroundColor: "green",
  },
  visitorInfoText: {
    paddingLeft: 7,
    fontSize: 16,
    // flex: 2,
    // backgroundColor: "red",
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
  locationIcon: {
    width: 50,
    height: 50,
  },
  visitorInfoTextButton: {
    paddingTop: -5,
    paddingLeft: 7,
    marginTop: -5,
    fontSize: 16,
  },
});
