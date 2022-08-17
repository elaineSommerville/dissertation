import { useState, useContext } from "react";
import { ScrollView, Text, TextInput, View, StyleSheet } from "react-native";
import ImagePicker from "../components/Upload/ImagePicker";
import PrimaryButton from "../components/PrimaryButton";
import UploadedImageContextProvider, {
  UploadedImageContext,
} from "../store/image-context";

function AddImage() {
  const imageCtx = useContext(UploadedImageContext);
  const [enteredCaption, setEnteredCaption] = useState("");
  const [enteredDate, setEnteredDate] = useState("");

  function changeCaptionHandler(enteredCaption) {
    setEnteredCaption(enteredCaption);
  }

  function changeDateHandler(enteredDate) {
    setEnteredDate(enteredDate);
  }

  function uploadHandler(enteredCaption, enteredDate) {
    if (!imageCtx) {
      Alert.alert("No image selected", "Please take a photo before uploading.");
      return;
    }
    imageCtx.uploadImage(enteredCaption, enteredDate);
  }

  return (
    <UploadedImageContextProvider>
      <ScrollView style={styles.form}>
        <View>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={styles.input}
            onChangeText={changeCaptionHandler}
            value={enteredCaption}
          />
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            onChangeText={changeDateHandler}
            value={enteredDate}
          />
        </View>
        <ImagePicker />
        <PrimaryButton title="Upload" onPress={uploadHandler} />
      </ScrollView>
    </UploadedImageContextProvider>
  );
}

export default AddImage;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
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
