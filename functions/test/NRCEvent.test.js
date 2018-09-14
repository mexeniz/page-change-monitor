const NRCEvent = require('../models/NRCEvent');
const assert = require('chai').assert;
const eventChangeCode = require('../constant').eventChangeCode;
const mockData = require('./mockData.json');

var MOCK_EVENT = mockData.MOCK_EVENT_1;

describe('NRCEvent Model', () => {

    it('should init instance correctly', () => {
        var event = new NRCEvent(MOCK_EVENT.id, MOCK_EVENT.name, MOCK_EVENT.capacity, MOCK_EVENT.registrationCount, MOCK_EVENT.location,
                                 MOCK_EVENT.startDate, MOCK_EVENT.endDate, MOCK_EVENT.openDate, MOCK_EVENT.closeDate);
        assert.equal(event.id, MOCK_EVENT.id);
        assert.equal(event.capacity, MOCK_EVENT.capacity);
        assert.equal(event.regCount, MOCK_EVENT.registrationCount);
    });

    it('should create instance from JSON object instance correctly', () => {
        var event = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        assert.equal(event.id, MOCK_EVENT.id);
        assert.equal(event.capacity, MOCK_EVENT.capacity);
        assert.equal(event.regCount, MOCK_EVENT.registrationCount);
        // Assert dateTime string
        assert.equal(event.eventDate, 'Wed 25 Jul');
        assert.equal(event.startDateTime, MOCK_EVENT.startDateTime);
        assert.equal(event.endDateTime, MOCK_EVENT.endDateTime);
        assert.equal(event.regDate, 'Thu 19 Jul');
        assert.equal(event.regDateTime, '18:30');
    });

    it('should be converted to JSON object correctly', () => {
        var jsonEvent = NRCEvent.prototype.fromJSON(MOCK_EVENT).toJSON();
        assert.typeOf(jsonEvent, 'object');
        assert.equal(jsonEvent.id, MOCK_EVENT.id);
        assert.equal(jsonEvent.id, MOCK_EVENT.id);
        assert.equal(jsonEvent.capacity, MOCK_EVENT.capacity);
        assert.equal(jsonEvent.regCount, MOCK_EVENT.registrationCount);
        // Assert dateTime string
        assert.equal(jsonEvent.eventDate, 'Wed 25 Jul');
        assert.equal(jsonEvent.startDateTime, MOCK_EVENT.startDateTime);
        assert.equal(jsonEvent.endDateTime, MOCK_EVENT.endDateTime);
        assert.equal(jsonEvent.regDate, 'Thu 19 Jul');
        assert.equal(jsonEvent.regDateTime, '18:30');
    });

    it('should be converted to string correctly', () => {
        var event = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        console.log('event.toString() : ');
        console.log(event.toString());
    });

    it('should be checked if event is full correclty', () => {
        var event = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        assert.isFalse(event.isFull());
        event.regCount = MOCK_EVENT.capacity;
        assert.isTrue(event.isFull());
    });

    it('should be checked if event is almost full correclty', () => {
        var event = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        assert.isFalse(event.isAlmostFull());
        event.regCount = MOCK_EVENT.capacity - 1;
        assert.isTrue(event.isAlmostFull());
        event.regCount = MOCK_EVENT.capacity - 3;
        assert.isTrue(event.isAlmostFull());
        event.regCount = MOCK_EVENT.capacity - 5;
        assert.isTrue(event.isAlmostFull());


        event.regCount = MOCK_EVENT.capacity - 6;
        assert.isFalse(event.isAlmostFull());
        event.regCount = MOCK_EVENT.capacity;
        assert.isFalse(event.isAlmostFull());
    });
});

describe('NRCEvent Change Comparison', () => {
    it('should compare event that has no any change correctly', () => {
        var event1 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        var event2 = NRCEvent.prototype.fromJSON(MOCK_EVENT);

        var change = NRCEvent.prototype.compareChange(event1, event2);
        assert.equal(change, eventChangeCode.NO_CHANGE);
    }); 

    it('should compare event that has just been full correctly', () => {
        var event1 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        var event2 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event2.regCount = MOCK_EVENT.capacity;
        
        var change = NRCEvent.prototype.compareChange(event1, event2);
        assert.equal(change, eventChangeCode.FULL);

        event1 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event2 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event1.regCount = MOCK_EVENT.capacity;
        event2.regCount = MOCK_EVENT.capacity;
        
        change = NRCEvent.prototype.compareChange(event1, event2);
        assert.equal(change, eventChangeCode.NO_CHANGE);
    }); 

    it('should compare event that has just had free slot correctly', () => {
        var event1 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event1.regCount = MOCK_EVENT.capacity;
        var event2 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event2.regCount = MOCK_EVENT.capacity - 2;
        
        var change = NRCEvent.prototype.compareChange(event1, event2);
        assert.equal(change, eventChangeCode.FREE_SLOT);
    });

    it('should compare event that has just been almost full correctly', () => {
        var event1 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event1.regCount = MOCK_EVENT.capacity - 10;
        var event2 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event2.regCount = MOCK_EVENT.capacity - 2;
        
        var change = NRCEvent.prototype.compareChange(event1, event2);
        assert.equal(change, eventChangeCode.ALMOST_FULL);
    }); 
});