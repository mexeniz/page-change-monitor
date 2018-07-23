var functions = require('firebase-functions');
var admin = require('firebase-admin');
// Init firebase features with admin access
admin.initializeApp(functions.config().firebase);
var lineApi = require('line-api');
var webChecker = require('./webChecker.js');
var config = require('./config.js');

var notifyWebChangeMessage = (url) => {
  return "Detected page change.\nCheck it out -> " + url;
};

var lineNotifySendMessage = (token, message) => {
  var notify = new lineApi.Notify({token: token});
  notify.send({message: message}).then(console.log).catch(console.error);
};

exports.webCheck = functions.https.onRequest((req, res) => {
  var notifyToken = req.query.notifyToken;
  if (notifyToken) {
    webChecker.isChanged(config.webUrl).then((isChanged) => {
      if (isChanged) {
        lineNotifySendMessage(notifyToken, notifyWebChangeMessage(config.webUrl));
      }
      return res.status(200).json({"change": isChanged});
    }).catch((err) => {
      res.status(400).json(err);
    });
  } else {
    res.status(400).send("Invalid request");
  }
});
