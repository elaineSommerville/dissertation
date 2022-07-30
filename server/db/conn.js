const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require("fs");
const credentials = "/etc/ssl/X509-cert-5160742847591166608.pem";
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  sslKey: credentials,
  sslCert: credentials,
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("ARchitecture");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};
