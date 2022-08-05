import { GOOGLE_MAPS_API_KEY } from "@env";

export function getMapPreview(lat, lng) {
  // use of backticks below allows dynamic data to be injected
  // can also think about signing the request down the line
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  return imagePreviewUrl;
}
