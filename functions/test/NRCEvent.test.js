const NRCEvent = require('../models/NRCEvent');
const assert = require('chai').assert;

var MOCK_EVENT = {
    'id': '105192',
    'name': 'READY SET GO RUN',
    'startDate': 1532545440000,
    'endDate': 1532550600000,
    'capacity': 170,
    'registrationCount': 170,
    'meetingPointDescription': 'ลานหน้าห้องสมุดประชาชน สวนลุมพินี',
    'meetingPointDescription2': '',
    'openDate': 1532025000000,
    'closeDate': 1532476740000,
    'headline': 'NRC BKK',
    'subHeadline1': '5KM',
    'seriesName': 'NRC BKK',
    'showFacebookShare': true,
    'showTwitterTweet': true,
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
        var event = new NRCEvent(MOCK_EVENT.id, MOCK_EVENT.name, MOCK_EVENT.capacity, MOCK_EVENT.registrationCount, MOCK_EVENT.location);
        assert.equal(event.id, MOCK_EVENT.id);
        assert.equal(event.capacity, MOCK_EVENT.capacity);
        assert.equal(event.regCount, MOCK_EVENT.registrationCount);
    });

    it('should create instance from JSON object instance correctly', () => {
        var event = NRCEvent.prototype.fromJSON(MOCK_EVENT);
        assert.equal(event.id, MOCK_EVENT.id);
        assert.equal(event.capacity, MOCK_EVENT.capacity);
        assert.equal(event.regCount, MOCK_EVENT.registrationCount);
    });
});