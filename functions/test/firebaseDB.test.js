const firebaseDB = require('../firebaseDB');
const serviceAccount = require('../serviceAccountKey.json');
const assert = require('chai').assert;
const mockData = require('./mockData.json');
const NRCEvent = require('../models/NRCEvent');
const admin = require('firebase-admin');

admin.initializeApp(serviceAccount);

const TEST_BASE_URL = '/testNRCEvents';

var NRC_EVENTS = [
    NRCEvent.prototype.fromJSON(mockData.MOCK_EVENT_1),
    NRCEvent.prototype.fromJSON(mockData.MOCK_EVENT_2)
];

var insertMockData = (db) => {
    let promises = [];
    for (let nrcEvent of NRC_EVENTS) {
        console.log('Mock insert event ' + nrcEvent.id);
        var eventId = nrcEvent.id;
        promises.push(db.ref(TEST_BASE_URL + '/' + eventId).set(nrcEvent.toJSON()));
    }
    return Promise.all(promises);
};

var cleanMockData = (db) => {
    return db.ref(TEST_BASE_URL).remove();
};

describe('FirebaseDB Interface', function () {
    this.timeout(10000);
    describe('Initialization', () => {
        it('should set database context successfully', (done) => {
            firebaseDB.setDBContext(admin.database());
            assert.isNotNull(firebaseDB.db);
            done();
        });
    });
    describe('Data Management', () => {
        beforeEach((done) => {
            firebaseDB.setDBContext(admin.database());
            firebaseDB.setBaseUrl(TEST_BASE_URL);
            insertMockData(admin.database()).then(() => {
                console.log("insertMockData done");
                done();
            });
        });

        it('should set baseUrl correctly', (done) => {
            var newBaseUrl = '/testSetBaseUrl';
            firebaseDB.setBaseUrl(newBaseUrl);
            assert.equal(firebaseDB.getBaseUrl(), newBaseUrl);
            done();
        });

        it('should get events correctly', (done) => {
            firebaseDB.getEvents().then((eventObj) => {
                assert.typeOf(eventObj, 'object');
                for (var id in eventObj) {
                    var nrcEvent = NRCEvent.prototype.fromJSON(eventObj[id]);
                    assert.instanceOf(nrcEvent, NRCEvent);
                }
                done();
            });
        });

        it('should get event by ID correctly', (done) => {
            var eventID = mockData.MOCK_EVENT_1.id;
            firebaseDB.getEvent(eventID).then((eventObj) => {
                assert.typeOf(eventObj, 'object');
                var nrcEvent = NRCEvent.prototype.fromJSON(eventObj);
                assert.instanceOf(nrcEvent, NRCEvent);
                assert.equal(nrcEvent.id, eventID);
                done();
            });
        });

        it('should get null event if ID does not exist', (done) => {
            firebaseDB.getEvent("someEventID").then(() => {
                assert.fail();
            }).catch((error)=>{
                assert.isNotNull(error);
                done();
            });
        });

        it('should set event', (done) => {
            var newNRCEvent = NRCEvent.prototype.fromJSON(mockData.MOCK_EVENT_3);
            firebaseDB.setEvent(newNRCEvent).then(() => {
                // Verify if newNRCEvent is set.
                firebaseDB.getEvent(newNRCEvent.id).then((eventObj) => {
                    assert.typeOf(eventObj, 'object');
                    var nrcEvent = NRCEvent.prototype.fromJSON(eventObj);
                    assert.instanceOf(nrcEvent, NRCEvent);
                    assert.equal(nrcEvent.id, newNRCEvent.id);
                    done();
                });
            });
        });

        it('should delete event by ID correctly', (done) => {
            firebaseDB.removeEvent(mockData.MOCK_EVENT_2.id).then(() => {
                // Verify if newNRCEvent is removed.
                firebaseDB.getEvent(mockData.MOCK_EVENT_2.id).then(() => {
                    assert.fail();
                }).catch((error)=>{
                    assert.isNotNull(error);
                    done();
                });
            });
        });

        afterEach((done) => {
            cleanMockData(admin.database()).then(() => {
                console.log("Cleaned database")
                done();
            });
        });
    });
});