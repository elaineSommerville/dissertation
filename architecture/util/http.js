import axios from "axios";
const BACKEND_URL = "http://localhost:5000";

export async function fetchLocations() {
  const response = await axios.get(BACKEND_URL + "/location");
  return response.data;
}

export async function fetchLocation(locationId) {
  const response = await axios.get(BACKEND_URL + "/location/" + locationId);
  return response.data;
}
