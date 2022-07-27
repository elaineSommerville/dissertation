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
 let myquery = { _id: ObjectId( req.params.id )};
 db_connect
     .collection("users")
     .findOne(myquery, function (err, result) {
       if (err) throw err;
       res.json(result);
     });
});
 
// PUT (update) a user by id
apiRoutes.route("/user/:id").put(function (req, response) {
 let db_connect = dbo.getDb(); 
 let myquery = { _id: ObjectId( req.params.id )}; 
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
    .updateOne(myquery, newvalues, function (err, res){
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});
 
// DELETE a user
apiRoutes.route("/user/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId( req.params.id )};
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
  let myobj = {
    name: req.body.name,
    description: req.body.description,
    lat: req.body.lat,
    long: req.body.long,
    type: req.body.type,
    style: req.body.style,
    buildDate: req.body.buildDate,
    architect: req.body.architect,
    visitorInfo: req.body.visitorInfo,
    images: req.body.images,
    videos: req.body.videos,
    stories: req.body.stories,
    submittedBy: req.body.submittedBy,
    submittedOn: req.body.submittedOn,
  };
  db_connect.collection("locations").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
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

 // GET a location by id
apiRoutes.route("/location/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("locations")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
 });

 // PUT (update) a location by id
apiRoutes.route("/location/:id").put(function (req, response) {
  let db_connect = dbo.getDb(); 
  let myquery = { _id: ObjectId( req.params.id )}; 
  let newvalues = {   
    $set: {     
      name: req.body.name,
      description: req.body.description,
      lat: req.body.lat,
      long: req.body.long,
      type: req.body.type,
      style: req.body.style,
      buildDate: req.body.buildDate,
      architect: req.body.architect,
      visitorInfo: req.body.visitorInfo,
      images: req.body.images,
      videos: req.body.videos,
      stories: req.body.stories,
      submittedBy: req.body.submittedBy,
      submittedOn: req.body.submittedOn,
    }, 
   };
   db_connect
     .collection("locations")
     .updateOne(myquery, newvalues, function (err, res){
       if (err) throw err;
       console.log("1 document updated");
       response.json(res);
     });
 });

 // DELETE a location
apiRoutes.route("/location/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("locations").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
 });

// --- END OF LOCATION ---
module.exports = apiRoutes;