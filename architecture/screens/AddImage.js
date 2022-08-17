import { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import ImagePicker from "../components/Upload/ImagePicker";
import UploadedImageContextProvider, {
  UploadedImageContext,
} from "../store/image-context";

function AddImage() {
  const imageCtx = useContext(UploadedImageContext);

  return (
    <UploadedImageContextProvider>
      <ScrollView style={styles.form}>
        <ImagePicker />
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
});
