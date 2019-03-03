var functions = require('firebase-functions');
var admin = require('firebase-admin');
// Init firebase features with admin access
admin.initializeApp(functions.config().firebase);
const firebaseDB = require('./firebaseDB');
firebaseDB.setDBContext(admin.database());

var lineApi = require('line-api');
var webChecker = require('./webChecker.js');

var notifyWebChangeMessage = (url, eventChanges) => {
  var message = "";
  for(let eventChange of eventChanges){
    message = message + eventChange.toString() + "\n\n";
  }
  return message + "Check it out -> " + url;
};
exports.notifyWebChangeMessage = notifyWebChangeMessage;

var lineNotifySendMessage = (tokens, message) => {
  tokens.forEach(token => {
    var notify = new lineApi.Notify({token: token});
    notify.send({message: message}).then(console.log).catch(console.error);
  });
};

exports.nrcEventCheck = functions.https.onRequest((req, res) => {
  let notifyTokens = req.body.notifyTokens;
  let webUrl = req.body.webUrl;
  if (notifyTokens) {
    webChecker.findChanges(webUrl).then((eventChanges) => {
      console.log("findChanges: " + eventChanges.length);
      if (eventChanges.length > 0) {
        let message = notifyWebChangeMessage(webUrl, eventChanges);
        console.log("Sending message: " + message);
        lineNotifySendMessage(notifyTokens, message);
        return res.status(200).json({"change": message});
      } else {
        return res.status(200).json({"change": "Nothing"});
      }
    }).catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
  } else {
    res.status(400).send("Invalid request");
  }
});
