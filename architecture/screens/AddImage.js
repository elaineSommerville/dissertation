import { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import ImagePicker from "../components/Upload/ImagePicker";
import UploadedImageContextProvider, {
  UploadedImageContext,
} from "../store/image-context";

function AddImage({ route }) {
  const locationId = route.params.locationId;
  const imageCtx = useContext(UploadedImageContext);

  return (
    <UploadedImageContextProvider>
      <ScrollView style={styles.form}>
        <ImagePicker locationId={locationId} />
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
