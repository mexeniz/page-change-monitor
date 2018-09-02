const test = require('firebase-functions-test')();
const sinon = require('sinon');
var admin = require('firebase-admin');

adminInitStub = sinon.stub(admin, 'initializeApp');
const myFunctions = require('../index.js');
const eventChangeCode = require('../constant').eventChangeCode;
const NRCEvent = require('../models/NRCEvent');
const EventChange = require('../models/EventChange');
const mockData = require('./mockData.json');
var MOCK_EVENT = mockData.MOCK_EVENT_1;
const SAMPLE_PAGE_URL = "https://www.nike.com/events-registration/series?id=1900";

describe('notifyWebChangeMessage', () => {
    var event ;
    var eventChanges ;
    beforeEach(() => {
        event = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        eventChanges = []
        eventChanges.push(new EventChange(event, eventChangeCode.NEW));
        eventChanges.push(new EventChange(event, eventChangeCode.DELETED));
        eventChanges.push(new EventChange(event, eventChangeCode.ALMOST_FULL));
        eventChanges.push(new EventChange(event, eventChangeCode.FULL));
        eventChanges.push(new EventChange(event, eventChangeCode.FREE_SLOT));
    });

    it('should create message string correctly', () => {
        var message = myFunctions.notifyWebChangeMessage(SAMPLE_PAGE_URL, eventChanges);
        console.log(message);
    });
});