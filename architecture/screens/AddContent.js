import { useState, useContext, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
} from "react-native";
import ImagePicker from "../components/Upload/ImagePicker";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import UploadedImageContextProvider from "../store/image-context";
import PrimaryButton from "../components/PrimaryButton";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { FIREBASE_API_KEY, FIREBASE_BUCKET } from "@env";

function AddContent({ route }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [pickedImage, setPickedImage] = useState();
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();
  const contentType = route.params.contentType;
  const locationId = route.params.locationId;

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
    // imageCtx.confirmImage(image);
  }
  // END USE CAMERA

  function uploadFile() {
    console.log("in uploadFile");
    const fileName = pickedImage.uri.replace(/^.*[\\\/]/, "");
    console.log("filename: " + fileName);
    const firebaseConfig = {
      apiKey: FIREBASE_API_KEY,
      storageBucket: "dissertation-poc.appspot.com",
    };
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const data = pickedImage.base64;

    const storageRef = ref(storage, "images/" + fileName);
    const metadata = {
      contentType: "image/jpeg",
    };
    uploadString(storageRef, data, "base64", metadata).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        console.log(url);
      });
    });
  }

  let imagePreview = <Text>No image taken yet</Text>;

  let uploadButton = (
    <PrimaryButton title="Take photo" onPress={takeImageHandler} />
  );
  if (pickedImage) {
    imagePreview = (
      <Image style={styles.image} source={{ uri: pickedImage.uri }} />
    );
    uploadButton = <PrimaryButton title="Upload" onPress={uploadFile} />;
  }

  return (
    <UploadedImageContextProvider>
      <ScrollView style={styles.form}>
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
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            onChangeText={changeBodyHandler}
            value={body}
          />
        </View>
        {uploadButton}
      </ScrollView>
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
