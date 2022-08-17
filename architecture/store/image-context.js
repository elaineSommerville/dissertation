import { createContext, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export const UploadedImageContext = createContext({
  uri: "",
  width: "",
  height: "",
  caption: "",
  date: "",
  imageData: "",
  confirmImage: (image) => {},
  uploadImage: (caption, date) => {},
});

function UploadedImageContextProvider({ children }) {
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");

  function confirmImage(image) {
    setUploadedImage(image);
  }

  function uploadImage(caption, date) {
    console.log("inside uploadImage");
    console.log("caption: " + caption);
    console.log("date: " + date);
    setCaption(caption);
    setDate(date);
  }

  const value = {
    uri: uploadedImage.uri,
    width: uploadedImage.width,
    height: uploadedImage.height,
    caption: caption,
    date: date,
    imageData: uploadedImage.base64,
    confirmImage: confirmImage,
    uploadImage: uploadImage,
  };
  console.log(value);
  return (
    <UploadedImageContext.Provider value={value}>
      {children}
    </UploadedImageContext.Provider>
  );
}

export default UploadedImageContextProvider;
