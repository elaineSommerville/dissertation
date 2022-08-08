import { Text, View, Image, StyleSheet } from "react-native";
import React from "react";
import YoutubePlayer from "react-native-youtube-iframe";
function VideoScreen({ route }) {
  const uri = route.params.uri;
  const caption = route.params.caption;
  return (
    <View style={styles.rootContainer}>
      <YoutubePlayer
        height={300}
        play={true}
        videoId={uri.substring(uri.length - 11, uri.length)}
      />
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

export default VideoScreen;

const styles = StyleSheet.create({
  // TO DO: Make screen rotatable
  rootContainer: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 250,
  },
  caption: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
    // fontWeight: "bold",
    // fontStyle: "italic",
  },
});
