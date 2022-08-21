import { createContext, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export const UploadedImageContext = createContext({
  uri: "",
  width: "",
  height: "",
  uri: "",
  // imageData: "",
  confirmImage: (image) => {},
});

function UploadedImageContextProvider({ children }) {
  const [uploadedImage, setUploadedImage] = useState("");

  function confirmImage(image) {
    setUploadedImage(image);
  }

  const value = {
    uri: uploadedImage.uri,
    width: uploadedImage.width,
    height: uploadedImage.height,
    uri: uploadedImage.uri,
    // imageData: uploadedImage.base64,
    confirmImage: confirmImage,
  };
  return (
    <UploadedImageContext.Provider value={value}>
      {children}
    </UploadedImageContext.Provider>
  );
}

export default UploadedImageContextProvider;
