import axios from "axios";

// need to use IP of laptop running server when testing on phone
const BACKEND_URL = "http://192.168.1.8:5000";
// const BACKEND_URL = "http://192.168.1.9:5000";
// const BACKEND_URL = "http://localhost:5000";
//
// ORIGINAL
// export async function searchLocations(query) {
//   const response = await axios.get(BACKEND_URL + "/location/search/" + query);
//   return response.data;
// }

export async function searchLocations(query, lng, lat) {
  const response = await axios.post(BACKEND_URL + "/location/search/" + query, {
    type: "Point",
    coordinates: [lng, lat],
  });
  return response.data;
}

export async function getDistance(lat, lng, id) {
  const response = await axios.post(BACKEND_URL + "/location/distance/" + id, {
    type: "Point",
    coordinates: [lng, lat],
  });
  return response.data;
}

export async function fetchLocations() {
  const response = await axios.get(BACKEND_URL + "/location");
  return response.data;
}

export async function fetchLocationsHeaders() {
  const response = await axios.get(BACKEND_URL + "/location/header");
  return response.data;
}

export async function fetchLocationsHeadersWithinMap(region) {
  const response = await axios.post(BACKEND_URL + "/location/map/header", {
    region,
  });
  return response.data;
}

export async function fetchLocation(locationId) {
  const response = await axios.get(BACKEND_URL + "/location/" + locationId);
  return response.data;
}

export async function uploadImage(token, locationId, image, caption, date) {
  const response = await axios.post(
    BACKEND_URL + "/location/" + locationId + "/image",
    {
      token: token,
      width: image.width,
      height: image.height,
      caption: caption,
      date: date,
      image: image.base64,
    }
  );
  return response.data;
}

export async function uploadStory(token, locationId, title, date, body, image) {
  console.log("http: in uploadStory");
  console.log("locationid:" + locationId);
  const response = await axios.post(
    BACKEND_URL + "/location/" + locationId + "/story",
    {
      token: token,
      title: title,
      date: date,
      body: body,
      image: image,
    }
  );
  return response.data;
}
