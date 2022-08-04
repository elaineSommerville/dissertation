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

// SEARCH all the locations
apiRoutes.route("/location/search/:query").get(function (req, res) {
  let query = { query: req.params.query };
  let db_connect = dbo.getDb();
  db_connect
    .collection("locations")
    // TO DO
    .find({
      $text: {
        $search: query,
      },
    })
    .project({ name: 1, type: 1, location: 1, buildDate: 1, address: 1 }) // thumbnail too?
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
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
module.exports = apiRoutes;
