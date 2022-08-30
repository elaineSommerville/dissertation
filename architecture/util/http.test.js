import { beforeAll, describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

import {
  searchLocations,
  fetchLocationsHeadersWithinMap,
  fetchLocation,
  uploadImage,
  uploadVideo,
  uploadStory,
} from "./http";

let query;
let lng;
let lat;
let region;
let validLocationId;
let invalidLocationId;
let response;

beforeEach(() => {
  vi.restoreAllMocks();
});

describe.concurrent("searchLocations()", () => {
  beforeAll(() => {
    // arrange
    query = "belfast";
    lng = 54.5;
    lat = -5.5;
  });

  it("should return a 'data' object when called", () => {
    // act & assert
    return expect(searchLocations(query, lng, lat)).resolves.toHaveProperty(
      "data"
    );
  });

  it("should return a 'status' object when called", () => {
    // act & assert
    return expect(searchLocations(query, lng, lat)).resolves.toHaveProperty(
      "status"
    );
  });
});

describe.concurrent("fetchLocationsHeadersWithinMap()", () => {
  beforeAll(() => {
    // arrange
    region = {
      latitude: 54.59803, // center
      longitude: -5.93049, // center
      latitudeDelta: 0.05, // essentially configures the zoom
      longitudeDelta: 0.05, // essentially configures the zoom
    };
  });

  it("should return a 'data' object when called", () => {
    // act & assert
    return expect(
      fetchLocationsHeadersWithinMap(region)
    ).resolves.toHaveProperty("data");
  });

  it("should return a 'status' object when called", () => {
    // act & assert
    return expect(
      fetchLocationsHeadersWithinMap(region)
    ).resolves.toHaveProperty("status");
  });
});

describe.concurrent("fetchLocation()", () => {
  beforeAll(async () => {
    // arrange
    // get a valid location Id
    region = {
      latitude: 54.59803, // center
      longitude: -5.93049, // center
      latitudeDelta: 0.05, // essentially configures the zoom
      longitudeDelta: 0.05, // essentially configures the zoom
    };
    response = await fetchLocationsHeadersWithinMap(region);
    validLocationId = response.data[0]._id;
  });

  it("should return a 'data' object when called with a valid location Id", () => {
    // act & assert
    return expect(fetchLocation(validLocationId)).resolves.toHaveProperty(
      "data"
    );
  });

  it("should return a 'status' object when called with a valid location Id", () => {
    // act & assert
    return expect(fetchLocation(validLocationId)).resolves.toHaveProperty(
      "status"
    );
  });

  it("should throw error 500 error when provided an invalid location Id", () => {
    // act & assert
    return expect(fetchLocation(invalidLocationId)).rejects.toThrow(/500/);
  });
});

describe.concurrent("Upload Functions", () => {
  let token = "mySecureToken";
  let contentType;
  let locationId = validLocationId;
  let image;
  let width;
  let height;
  let userid = "placeholderUserID";
  let title;
  let date;
  let videoUri;
  let body;

  describe.concurrent("uploadImage()", () => {
    beforeAll(() => {
      // arrange
      contentType = "images";
      image = "myBase64EncodedDate";
      width = 100;
      height = 100;
      title = "myTitle";
      date = "Early 1960s";
    });

    it("should call axios", () => {
      vi.mock("axios");
      // act & assert
      uploadImage(token, contentType, locationId, image, title, date);

      return expect(axios.post).toBeCalled();
    });
  });

  describe.concurrent("uploadVideo()", () => {
    beforeAll(() => {
      // arrange
      contentType = "videos";
      videoUri = "https://www.youtube.com/somevideoid";
      title = "myTitle";
      date = "Early 1960s";
    });

    it("should call axios", () => {
      vi.mock("axios");
      // act & assert
      uploadVideo(token, contentType, locationId, videoUri, title, date);

      return expect(axios.post).toBeCalled();
    });
  });

  describe.concurrent("uploadStory()", () => {
    beforeAll(() => {
      // arrange
      contentType = "images";
      image = "myBase64EncodedDate";
      width = 100;
      height = 100;
      title = "myTitle";
      date = "Early 1960s";
      body = "Here is my story. Those were the good old days.";
    });

    it("should call axios", () => {
      vi.mock("axios");
      // act & assert
      uploadStory(token, contentType, locationId, image, title, date, body);

      return expect(axios.post).toBeCalled();
    });
  });
});
