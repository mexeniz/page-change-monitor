const test = require('firebase-functions-test')();
const sinon = require('sinon');
var admin = require('firebase-admin');

adminInitStub = sinon.stub(admin, 'initializeApp');
const myFunctions = require('../index.js');