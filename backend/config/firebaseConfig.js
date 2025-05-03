const admin = require("firebase-admin");
const serviceAccount = require("./mindcare-f5693-firebase-adminsdk-fbsvc-ffb383397d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:  "mindcare-f5693.firebasestorage.app" 
});

const bucket = admin.storage().bucket();

module.exports = bucket;
