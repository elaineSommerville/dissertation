const express = require("express");

// apiRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const apiRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// --- START OF USER ---

// POST (add) a user
//creates a user object (associative array in js)
apiRoutes.route("/user").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    userCreatedOn: req.body.userCreatedOn,
    passwordChangedOn: req.body.passwordChangedOn,
  };
  db_connect.collection("users").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// GET all the users
apiRoutes.route("/user").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("users")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// GET a user by id
apiRoutes.route("/user/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// PUT (update) a user by id
apiRoutes.route("/user/:id").put(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      name: req.body.name,
      role: req.body.role,
      email: req.body.email,
      passwordHash: req.body.passwordHash,
      userCreatedOn: req.body.userCreatedOn,
      passwordChangedOn: req.body.passwordChangedOn,
    },
  };
  db_connect
    .collection("users")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// DELETE a user
apiRoutes.route("/user/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

// --- END OF USER ---

// --- START OF LOCATION ---

// POST (add) location
//creates a location object (associative array in js)
apiRoutes.route("/location").post(function (req, response) {
  let db_connect = dbo.getDb();
  db_connect.collection("locations").insertOne(req.body, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// // SEARCH all the locations original
// apiRoutes.route("/location/search/:query").get(function (req, res) {
//   let query = req.params.query;
//   let db_connect = dbo.getDb();
//   db_connect
//     .collection("locations")
//     // TO DO
//     .find({
//       $text: {
//         $search: query,
//       },
//     })
//     .project({ name: 1, type: 1, location: 1, buildDate: 1, address: 1 }) // thumbnail too?
//     .toArray(function (err, result) {
//       if (err) throw err;
//       res.json(result);
//       // res.json("search result");
//     });
// });

// SEARCH all the locations original
apiRoutes.route("/location/search/:query").post(function (req, res) {
  let query = req.params.query;
  let userLocation = req.body;
  let db_connect = dbo.getDb();
  console.log("query: " + query);
  try {
    db_connect
      .collection("locations")
      // TO DO
      .aggregate([
        {
          $geoNear: {
            near: userLocation,
            spherical: true,
            distanceField: "distance",
            maxDistance: 50000,
            query: {
              $or: [
                { name: new RegExp(query, "i") },
                { type: new RegExp(query, "i") },
                { "visitorInfo.address": new RegExp(query, "i") },
                { "architect.name": new RegExp(query, "i") },
              ],
            },
          },
        },
      ])
      .project({
        name: 1,
        type: 1,
        location: 1,
        buildDate: 1,
        "visitorInfo.address": 1,
        distance: 1,
      }) // thumbnail too?
      .toArray(function (err, result) {
        // if (err) throw err;
        res.json(result);
        // res.json("search result");
      });
  } catch (err) {
    throw err;
  }
});

apiRoutes.route("/location/distance/:id").post(function (req, res) {
  let userLocation = req.body;
  let locationId = { _id: ObjectId(req.params.id) };
  let db_connect = dbo.getDb();
  db_connect
    .collection("locations")
    .aggregate([
      {
        $geoNear: {
          near: userLocation,
          spherical: true,
          distanceField: "distance",
          maxDistance: 10000,
          query: locationId,
        },
      },
    ])
    .project({
      distance: 1,
    }) // thumbnail too?
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
      // res.json("search result");
    });
});

// GET all the locations
apiRoutes.route("/location").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("locations")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  // db_connect.collection("locations").createIndex({ location: "2dsphere" });
  // db_connect.collection("locations").createIndex({
  //   name: "text",
  //   type: "text",
  // });
});

// GET all the locations - HEADER INFORMATION ONLY FOR MAP
apiRoutes.route("/location/header").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("locations")
    .find({})
    .project({ name: 1, type: 1, location: 1, buildDate: 1, address: 1 }) // thumbnail too?
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// get records within map boundary
apiRoutes.route("/location/map/header").post(function (req, response) {
  if (req.body.region) {
    const lat = req.body.region.latitude;
    const latD = req.body.region.latitudeDelta;
    const lng = req.body.region.longitude;
    const lngD = req.body.region.longitudeDelta;
    // console.log("box: ");
    // console.log(lng - lngD);
    // console.log(lat - latD);
    // console.log(lng + lngD);
    // console.log(lat + latD);
    let db_connect = dbo.getDb();
    db_connect
      .collection("locations")
      .find({
        location: {
          $geoWithin: {
            // $geometry: {
            // type: "Polygon",
            // // important!!!
            // // 1. first and last coordinate must be the same to close the polygon or will get a
            // //      "MongoServerError: Loop is not closed" error.
            // // 2. coordinates must go either clockwise or anticlockwise and not cross over eachother.
            // // 3. list long first, then lat
            // // should look like this => coordinates: [ [ [-6, 55], [-6, 54], [-5, 54], [-5, 55], [-6, 55] ] ]
            // coordinates: [array2polygon(req.params.polygon.split(","))],
            // TO DO REGION TO POLYGON
            $box: [
              [
                // bottom left
                lng - lngD,
                lat - latD,
              ],
              [
                lng + lngD,
                lat + latD,
                // upper right
              ],
            ],
            // },
          },
        },
      })
      .project({ name: 1, type: 1, location: 1, buildDate: 1, address: 1 }) // thumbnail too?
      .toArray(function (err, result) {
        if (err) throw err;
        response.json(result);
      });
  }
});

// GET a location by id
apiRoutes.route("/location/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("locations").findOne(myquery, function (err, result) {
    if (err) {
      return console.log("error: " + err);
    }
    res.json(result);
  });
});

// PUT (update) a location by id
apiRoutes.route("/location/:id").put(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect
    .collection("locations")
    .replaceOne(myquery, req.body, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// DELETE a location
apiRoutes.route("/location/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("locations").deleteOne(myquery, function (err, obj) {
    if (err) {
      return console.log("error: " + err);
    }
    console.log({ _id: req.params.id });
    console.log("1 document deleted");
    response.json(obj);
  });
});

// --- END OF LOCATION ---

// --- START UPLOADS ---

apiRoutes.route("/location/:id/image").post(function (req, response) {
  let db_connect = dbo.getDb();
  const token = req.body.token;
  // TO DO: verify token
  if (token) {
    let myquery = { _id: ObjectId(req.params.id) };
    let updateDocument = "";
    updateDocument = {
      $push: {
        images: {
          title: req.body.title,
          sourceDate: req.body.date,
          width: req.body.width,
          height: req.body.height,
          imageData: req.body.image,
          submittedBy: "placeholder user id",
          submittedOn: Math.floor(Date.now() / 1000),
        },
      },
    };
    db_connect
      .collection("locations")
      .updateOne(myquery, updateDocument, function (err, res) {
        if (err) {
          return console.log("error: " + err);
        }
        console.log("1 document updated");
        response.json(res);
      });
  } else {
    return response.json("No token present.");
  }
});

apiRoutes.route("/location/:id/video").post(function (req, response) {
  let db_connect = dbo.getDb();
  const token = req.body.token;
  const thumbnail =
    "https://img.youtube.com/vi/" +
    req.body.videoUri.substring(uri.length - 11, uri.length) +
    "/maxresdefault.jpg";
  // TO DO: verify token
  if (token) {
    let myquery = { _id: ObjectId(req.params.id) };
    let updateDocument = "";
    updateDocument = {
      $push: {
        videos: {
          title: req.body.title,
          sourceDate: req.body.date,
          videoUri: req.body.videoUri,
          thumbnail: thumbnail,
          submittedBy: "placeholder user id",
          submittedOn: Math.floor(Date.now() / 1000),
        },
      },
    };
    db_connect
      .collection("locations")
      .updateOne(myquery, updateDocument, function (err, res) {
        if (err) {
          return console.log("error: " + err);
        }
        console.log("1 document updated");
        response.json(res);
      });
  } else {
    return response.json("No token present.");
  }
});

apiRoutes.route("/location/:id/story").post(function (req, response) {
  let db_connect = dbo.getDb();
  const token = req.body.token;
  // TO DO: verify token
  if (token) {
    let myquery = { _id: ObjectId(req.params.id) };
    let updateDocument = "";
    updateDocument = {
      $push: {
        stories: {
          title: req.body.title,
          sourceDate: req.body.date,
          body: req.body.body,
          width: req.body.width,
          height: req.body.height,
          imageData: req.body.image,
          submittedBy: "placeholder user id",
          submittedOn: Math.floor(Date.now() / 1000),
        },
      },
    };
    db_connect
      .collection("locations")
      .updateOne(myquery, updateDocument, function (err, res) {
        if (err) {
          return console.log("error: " + err);
        }
        console.log("1 document updated");
        response.json(res);
      });
  } else {
    return response.json("No token present.");
  }
});
// --- END UPLOADS ---
module.exports = apiRoutes;
