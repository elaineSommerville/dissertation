import axios from "axios";

// need to use IP of laptop running server when testing on phone
const BACKEND_URL = "http://192.168.1.6:5000";
// const BACKEND_URL = "http://localhost:5000";

export async function searchLocations(query) {
  const response = await axios.get(BACKEND_URL + "/search/" + query);
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
