var axios = require('axios');
var https = require('https');
var minify = require('html-minifier').minify;
var crypto = require('crypto');
const JSON5 = require('json5')
var admin = require('firebase-admin');
var config = require('./config.js');

var instance = axios.create({baseURL: '', timeout: 10000});

exports.extractContent = (pageData, regex) => {
  if (regex) {
    var matchStrings = regex.exec(pageData);
    if (matchStrings !== null) {
      return matchStrings;
    }else{
      return null;
    }
  }else {
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

exports.isChanged = (webUrl) => {
  const requestConfig = {
    method: 'get',
    url: webUrl,
    httpsAgent: new https.Agent({keepAlive: true})
  };
  var dataHash = "";
  var urlId = "";
  return instance.request(requestConfig).then(res => {
    var data = extractContent(minifyPage(res.data), config.dataRegex);
    if (data === null){
      console.error("Error: target data not found");
      reject();
    }
    dataString = data.join("");
    dataHash = crypto.createHash('md5').update(dataString).digest("hex");
    urlId = crypto.createHash('md5').update(webUrl).digest("hex");
    // Read old hash from database
    return admin.database().ref('/page/' + urlId).once('value');
  }).then((snapshot) => {
    var pageChange = false;
    var oldHash = null;
    if (snapshot.val() && snapshot.val().hash) {
      oldHash = snapshot.val().hash;
      pageChange = dataHash !== oldHash;
    } else {
      // First time monitoring
      console.error("Error: page not found: " + urlId);
    }
    console.log("newHash: " + dataHash + " oldHash: " + oldHash + " change: " + pageChange);
    // Update record in database
    admin.database().ref('/page/' + urlId).set({hash: dataHash, url: webUrl});
    return pageChange;
  }).catch(err => {
    console.log(err);
  });
};
