import { Text, View, Image, StyleSheet } from "react-native";
function StoryScreen({ route }) {
  const image = route.params.story.image;
  const title = route.params.story.title;
  const subtitle = route.params.story.subtitle;
  const body = route.params.story.body;
  console.log(route.params);
  return (
    <View style={styles.rootContainer}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

export default StoryScreen;

const styles = StyleSheet.create({
  // TO DO: Make screen rotatable
  rootContainer: {
    flex: 1,
  },
  textContainer: {
    marginHorizontal: 18,
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "bold",
    // fontStyle: "italic",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "bold",
    color: "#aaa",
  },
  body: {
    marginTop: 6,
  },
});
