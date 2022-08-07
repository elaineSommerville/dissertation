import { Text, View, Image, StyleSheet } from "react-native";
function StoryScreen({ route }) {
  // const uri = route.params.uri;
  // const caption = route.params.caption;
  return (
    <View style={styles.rootContainer}>
      <Text>Story Screen</Text>
      {/* <Image source={{ uri: uri }} style={styles.image} />
      <Text style={styles.caption}>{caption}</Text> */}
    </View>
  );
}

export default StoryScreen;

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
