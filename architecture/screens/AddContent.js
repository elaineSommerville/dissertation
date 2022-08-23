import { useState, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Alert,
} from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import UploadedImageContextProvider from "../store/image-context";
import PrimaryButton from "../components/PrimaryButton";
import { uploadImage, uploadStory, uploadVideo } from "../util/http";
import { AuthContext } from "../store/auth-context";
import { useNavigation } from "@react-navigation/native";

function AddContent({ route }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [videoUri, setVideoUri] = useState("");
  // const [contentType, setContentType] = useState("");
  const [pickedImage, setPickedImage] = useState();
  const [uploadContentResponse, setUploadContentResponse] = useState();
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();
  const contentType = route.params.contentType;
  const locationId = route.params.locationId;
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  // const [token, setToken] = useState("");
  const token = authCtx.token;

  // START TEXT INPUT HANDLERS
  function changeTitleHandler(enteredTitle) {
    setTitle(enteredTitle);
  }

  function changeDateHandler(enteredDate) {
    setDate(enteredDate);
  }

  function changeBodyHandler(enteredBody) {
    setBody(enteredBody);
  }

  function changeVideoUriHandler(enteredVideoUri) {
    setVideoUri(enteredVideoUri);
  }
  // END TEXT INPUT HANDLERS

  // START CAMERA PERMISSIONS
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
  // END CAMERA PERMISSIONS

  // START USE CAMERA
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
    setPickedImage(image);
  }
  // END USE CAMERA

  async function uploadImageHandler() {
    console.log("in uploadImageHandler");
    try {
      console.log("in try");
      const response = await uploadImage(
        token,
        contentType,
        locationId,
        pickedImage,
        title,
        date
      );
      setUploadContentResponse(response);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadVideoHandler() {
    console.log("in uploadVideoHandler");
    try {
      console.log(videoUri);
      console.log("in try");
      const response = await uploadVideo(
        token,
        contentType,
        locationId,
        videoUri,
        title,
        date
      );
      setUploadContentResponse(response);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadStoryHandler() {
    console.log("in uploadStoryHandler");
    try {
      console.log("in try");
      const response = await uploadStory(
        token,
        contentType,
        locationId,
        pickedImage,
        title,
        date,
        body
      );
      setUploadContentResponse(response);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  let imagePreview = <Text>No image taken yet</Text>;

  if (pickedImage && pickedImage.base64) {
    imagePreview = (
      <Image style={styles.image} source={{ uri: pickedImage.uri }} />
    );
  }

  let inputForm = <></>;
  switch (contentType) {
    case "images":
      inputForm = (
        <>
          <View style={styles.imagePreview}>{imagePreview}</View>
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
          </View>
          <PrimaryButton title="Take photo" onPress={takeImageHandler} />
          <PrimaryButton title="Upload" onPress={uploadImageHandler} />
        </>
      );
      break;
    case "stories":
      inputForm = (
        <>
          <View style={styles.imagePreview}>{imagePreview}</View>
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
          <PrimaryButton title="Take photo" onPress={takeImageHandler} />
          <PrimaryButton title="Upload" onPress={uploadStoryHandler} />
        </>
      );
      break;
    case "videos":
      inputForm = (
        <>
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
            <Text style={styles.label}>
              Video URI. Please upload your video to YouTube and paste the URI
              below.
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={changeVideoUriHandler}
              value={videoUri}
            />
          </View>
          <PrimaryButton title="Submit" onPress={uploadVideoHandler} />
        </>
      );
      break;
    default:
      inputForm = <></>;
  }

  return (
    <UploadedImageContextProvider>
      <ScrollView style={styles.form}>{inputForm}</ScrollView>
    </UploadedImageContextProvider>
  );
}

export default AddContent;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
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
