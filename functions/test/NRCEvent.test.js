const NRCEvent = require('../models/NRCEvent');
const assert = require('chai').assert;
const eventChange = require('../constant').eventChange;

var MOCK_EVENT = {
    'id': '105192',
    'name': 'READY SET GO RUN',
    'startDate': 1532545440000,
    'endDate': 1532550600000,
    'capacity': 170,
    'registrationCount': 150,
    'meetingPointDescription': 'ลานหน้าห้องสมุดประชาชน สวนลุมพินี',
    'meetingPointDescription2': '',
    'openDate': 1532025000000,
    'closeDate': 1532476740000,
    'headline': 'NRC BKK',
    'subHeadline1': '5KM',
    'seriesName': 'NRC BKK',
    'startDateMonth': 'ก.ค.',
    'startDateDayOfMonth': '25',
    'startDateDayOfWeek': 'วันพุธ',
    'startDateTime': '19:04',
    'startDatePeriod': '',
    'endDateTime': '20:30',
    'endDatePeriod': '',
    'openDateYear': null,
    'openDateMonth': 'ก.ค.',
    'openDateDayOfMonth': '19',
    'openDateDayOfWeek': null,
    'openDateTime': null
};

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

    it('should be converted to string correctly', () => {
        var event = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        console.log('event.toString()');
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

describe('NRCEvent Model', () => {
    it('should compare event that has no any change correctly', () => {
        var event1 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        var event2 = NRCEvent.prototype.fromJSON(MOCK_EVENT);

        var change = NRCEvent.prototype.compareChange(event1, event2);
        assert.equal(change, eventChange.NO_CHANGE);
    }); 

    it('should compare event that has just been full correctly', () => {
        var event1 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        var event2 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event2.regCount = MOCK_EVENT.capacity;
        
        var change = NRCEvent.prototype.compareChange(event1, event2);
        assert.equal(change, eventChange.FULL);
    }); 

    it('should compare event that has just had free slot correctly', () => {
        var event1 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event1.regCount = MOCK_EVENT.capacity;
        var event2 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event2.regCount = MOCK_EVENT.capacity - 2;
        
        var change = NRCEvent.prototype.compareChange(event1, event2);
        assert.equal(change, eventChange.FREE_SLOT);
    });

    it('should compare event that has just been almost full correctly', () => {
        var event1 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event1.regCount = MOCK_EVENT.capacity - 10;
        var event2 = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        event2.regCount = MOCK_EVENT.capacity - 2;
        
        var change = NRCEvent.prototype.compareChange(event1, event2);
        assert.equal(change, eventChange.ALMOST_FULL);
    }); 
});