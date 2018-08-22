const eventChangeCode = require('../constant').eventChangeCode;

function EventChange(nrcEvent, code) {
    this.nrcEvent = nrcEvent;
    this.code = code;
};

/**
 * Convert instance to a string.
 */
EventChange.prototype.toString = function () {
    var eventString = `Event: ${this.name}\n` +
        `Registerd: ${this.regCount}/${this.capacity}\n` +
        `Open date: ${this.regDate} ${this.regDateTime}\n` +
        `Run date: ${this.eventDate} ${this.startDateTime}-${this.endDateTime}\n`;
    return eventString;
};

/**
 * Convert instance to a JSON object.
 */
EventChange.prototype.toJSON = function () {
    var jsonObj = {
        nrcEvent: this.nrcEvent,
        code: this.code
    };
    return jsonObj;
};

module.exports = EventChange;