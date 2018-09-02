var functions = require('firebase-functions');
var admin = require('firebase-admin');
// Init firebase features with admin access
admin.initializeApp(functions.config().firebase);
var lineApi = require('line-api');
var webChecker = require('./webChecker.js');
var config = require('./config.js');

exports.notifyWebChangeMessage = (url, eventChanges) => {
  var message = "";
  for(let eventChange of eventChanges){
    message = message + eventChange.toString() + "\n\n";
  }
  return message + "Check it out -> " + url;
};

var lineNotifySendMessage = (token, message) => {
  var notify = new lineApi.Notify({token: token});
  notify.send({message: message}).then(console.log).catch(console.error);
};

exports.webCheck = functions.https.onRequest((req, res) => {
  var notifyToken = req.query.notifyToken;
  if (notifyToken) {
    webChecker.findChanges(config.webUrl).then((eventChanges) => {
      if (eventChanges.length > 0) {
        let message = notifyWebChangeMessage(config.webUrl, eventChanges)
        lineNotifySendMessage(notifyToken, message);
        return res.status(200).json({"change": message});
      } else {
        return res.status(200).json({"change": "Nothing"});
      }
    }).catch((err) => {
      res.status(400).json(err);
    });
  } else {
    res.status(400).send("Invalid request");
  }
});
