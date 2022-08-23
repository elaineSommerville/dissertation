import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { FIREBASE_API_KEY } from "@env";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  // authDomain: "PROJECT_ID.firebaseapp.com",
  // // The value of `databaseURL` depends on the location of the database
  // databaseURL: "https://DATABASE_NAME.firebaseio.com",
  // projectId: "PROJECT_ID",
  storageBucket: "dissertation-poc.appspot.com",
  // messagingSenderId: "SENDER_ID",
  // appId: "APP_ID",
  // // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  // measurementId: "G-MEASUREMENT_ID",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const storageRef = ref(storage);
const message2 = "5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
uploadString(storageRef, message2, "base64").then((snapshot) => {
  console.log("Uploaded a base64 string!");
});
