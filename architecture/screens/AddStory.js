import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { uploadStory } from "../util/http";

function AddStory({ route }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [response, setResponse] = useState();
  const locationId = route.params.locationId;
  console.log("const locationId");
  console.log(locationId);
  // setLocationId(route.params.locationId);

  function changeTitleHandler(enteredTitle) {
    setTitle(enteredTitle);
  }

  function changeDateHandler(enteredDate) {
    setDate(enteredDate);
  }

  function changeBodyHandler(enteredBody) {
    setBody(enteredBody);
  }

  async function uploadHandler() {
    const test = "test";
    console.log("in uploadHandler");
    console.log();
    // const locId = locationId;
    if (!title) {
      Alert.alert("Missing title", "Please enter a title.");
      return;
    }
    if (!body) {
      Alert.alert("Missing story", "Please enter a story.");
      return;
    }
    try {
      console.log("in uploadHandler - try");
      console.log("locationId: ");
      console.log(locationId);
      const result = await uploadStory(
        "mysecuretoken",
        locationId,
        title,
        date,
        body
      );
      setResponse(result);
    } catch (error) {
      console.log("in uploadHandler - error");
      Alert.alert("Error", error.message);
    }
    console.log("in uploadHandler - last bit");
    // console.log(uploadImageResponse);
  }

  return (
    <View>
      {/* <View style={styles.imagePreview}>{imagePreview}</View> */}
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={title}
        />
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeDateHandler}
          value={date}
        />
        <Text style={styles.label}>Story</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeBodyHandler}
          value={body}
        />
      </View>
      <PrimaryButton title="Add Story" onPress={uploadHandler} />
    </View>
  );
}

export default AddStory;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: "black",
    borderBottomWidth: 2,
    backgroundColor: "white",
  },
});
