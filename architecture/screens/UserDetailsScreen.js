import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { fetchUser } from "../util/http";
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

function UserDetailsScreen({ route, navigation }) {
  const userId = route.params.userId;
  const [fetchedUser, setFetchedUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    async function getUser(userId) {
      try {
        const user = await fetchUser(userId);
        setFetchedUser(user);
      } catch (error) {
        setError("Could not fetch user details...");
      }
      setIsLoading(false);
    }
    getUser(userId);
  }, []);

  const name = fetchedUser.name;
  const age = new Date(fetchedUser.age * 1000);
  const avatar = fetchedUser.avatar;
  const hometown = fetchedUser.hometown;
  const bio = fetchedUser.bio;
  const buildingsVisitedGenre = fetchedUser.buildingsVisitedGenre;
  //const likedBuildings = fetchedUser.likedBuildings;
  const myStories = fetchedUser.myStories;
  const myPictures = fetchedUser.myPictures;

  const myPicturesUris = [];
  const myPicturesImageCaptions = [];

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
    // once location data has been received, push images into myPicturesUri array
    // for image slider of the usesrs photo gallery of places they've visited
    myPictures.map((image) => {
      myPicturesUris.push(image.uri);
      myPicturesImageCaptions.push(image.name);
    });
    return (
      <ScrollView style={styles.rootContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.typeView}>
            <Ionicons name={avatar} size={30} />
          </View>
          <View style={styles.nameAddressView}>
            <Text style={styles.nameView}>{name}</Text>
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
          <Text style={styles.heading}>Name</Text>
          <Text style={styles.heading}>Age</Text>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.info}>{name}</Text>
          <Text style={styles.info}>{age}</Text>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Home Town</Text>
          <Text style={styles.heading}>Buildings Visited</Text>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.info}>{hometown}</Text>
          {/* view the types of buildings the user has visited //each 'type' of
          building is displayed with an icon - eg: church, school 
          the number of each type of building visited is displayed underneath eg: 'x5' */}
          <View style={styles.listView}>
            {buildingsVisitedGenre.map((buildingsVisitedGenre, index) => {
              return (
                <Text style={styles.info} key={index}>
                  {buildingsVisitedGenre.name} //or genre?
                </Text>
              );
            })}
          </View>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.bioView}>
            <Text style={styles.heading}>Bio</Text>
            <Text>{bio}</Text>
          </View>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.myStoriesView}>
            <Text style={styles.heading}>My Stories</Text>
            <Text>{myStories}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default UserDetailsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginBottom: 32,
    marginHorizontal: 25,
  },
  nameView: {
    fontWeight: "bold",
  },
  typeView: {
    width: 75,
    flex: 0.15,
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
  bioView: {
    flexDirection: "column",
  },
  myStoriesView: {
    flexDirection: "column",
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContents: "center",
  },
});
