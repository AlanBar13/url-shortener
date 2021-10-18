var admin = require('firebase-admin')
var serviceAccount = require("../url-shortener-496a7-firebase-adminsdk-acvqk-174e7d8970.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

module.exports = {db, admin}
