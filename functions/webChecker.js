var axios = require('axios');
var https = require('https');
var minify = require('html-minifier').minify;
const EventChange = require('./models/EventChange');
const NRCEvent = require('./models/NRCEvent');
const eventChangeCode = require('./constant').eventChangeCode;
const JSON5 = require('json5');
const firebaseDB = require('./firebaseDB');
var config = require('./config.js');

var instance = axios.create({
  baseURL: '',
  timeout: 10000
});

exports.extractContent = (pageData, regex) => {
  if (regex) {
    var matchStrings = regex.exec(pageData);
    if (matchStrings !== null) {
      return matchStrings;
    } else {
      return null;
    }
  } else {
    return pageData;
  }
};

exports.parseContent = (content, replaceRegex) => {
  // Sanitize content string
  content = content.replace(replaceRegex, '');
  return JSON5.parse(content);
};

exports.minifyPage = (pageData) => {
  var minifyConfig = {
    removeEmptyAttributes: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true
  };
  return minify(pageData, minifyConfig);
}

exports.findChanges = (webUrl) => {
  const requestConfig = {
    method: 'get',
    url: webUrl,
    httpsAgent: new https.Agent({
      keepAlive: true
    })
  };
  var newNRCEventMap = {};
  var oldNRCEventMap = {};
  let eventChanges = [];
  return instance.request(requestConfig).then(res => {
    var content = exports.extractContent(res.data, config.contentRegex);
    if (content === null) {
      console.error("Error: target data not found");
      reject();
    }
    var data = exports.parseContent(content[0], config.contentReplaceRegex);
    for (let eventData of data.multiPage.events) {
      newNRCEventMap[eventData.id] = NRCEvent.prototype.fromJSON(eventData);
    }
    console.log("Parsed contents: " + Object.keys(newNRCEventMap).length);
    return firebaseDB.getEvents();
  }).then((eventObj) => {
    if (eventObj !== null) {
      for (var id in eventObj) {
        oldNRCEventMap[id] = NRCEvent.prototype.fromJSON(eventObj[id]);
      }
    } else {
      console.error("Old NRC Events is empty.");
    }
    // Compare each event ...
    // Check deleted event
    for (let id in oldNRCEventMap) {
      if (!(id in newNRCEventMap)) {
        console.log("Found delete event: " + id);
        eventChanges.push(new EventChange(oldNRCEventMap[id], eventChangeCode.DELETED))
      }
    }
    for (let id in newNRCEventMap) {
      if (!(id in oldNRCEventMap)) {
        // New event
        console.log("Found new event: " + id);
        eventChanges.push(new EventChange(newNRCEventMap[id], eventChangeCode.NEW))
      } else {
        var code = NRCEvent.prototype.compareChange(oldNRCEventMap[id], newNRCEventMap[id]);
        console.log("Found event change: " + id + ", code=" + code);
        if (code !== eventChangeCode.NO_CHANGE && code !== eventChangeCode.ALMOST_FULL) {
          eventChanges.push(new EventChange(newNRCEventMap[id], code))
        }
      }
    }
    // Create promises for update DB
    // Update record in database
    return firebaseDB.setEvents(newNRCEventMap).then(() => {
      console.log("Saved event successfully.");
      return eventChanges;
    });
  }).catch(err => {
    console.log(err);
  });
};