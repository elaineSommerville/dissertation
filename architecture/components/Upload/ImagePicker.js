import {
  View,
  Button,
  TextInput,
  Alert,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState, useContext } from "react";
import {
  UploadedImageContextProvider,
  UploadedImageContext,
} from "../../store/image-context";
import PrimaryButton from "../PrimaryButton";

function ImagePicker() {
  const [pickedImage, setPickedImage] = useState();
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const imageCtx = useContext(UploadedImageContext);
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  function changeCaptionHandler(caption) {
    setCaption(caption);
  }

  function changeDateHandler(date) {
    setDate(date);
  }

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions",
        "Camera permissions required to use this feature."
      );
      return false;
    }
    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      base64: true,
    });
    console.log("pickedImage");
    console.log(pickedImage);
    setPickedImage(image);
    imageCtx.confirmImage(image);
  }

  function addCaptionDateHandler() {
    imageCtx.uploadImage(caption, date);
  }

  let imagePreview = <Text>No image taken yet</Text>;

  if (pickedImage) {
    imagePreview = (
      <Image style={styles.image} source={{ uri: pickedImage.uri }} />
    );
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <View>
        <Text style={styles.label}>Caption</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeCaptionHandler}
          value={caption}
        />
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeDateHandler}
          value={date}
        />
      </View>
      <Button title="Take photo" onPress={takeImageHandler} />
      <PrimaryButton title="Upload" onPress={addCaptionDateHandler} />
    </View>
  );
}

export default ImagePicker;

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
