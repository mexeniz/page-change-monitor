const eventChangeCode = require('../constant').eventChangeCode;

function EventChange(nrcEvent, code) {
    this.nrcEvent = nrcEvent;
    this.code = code;
}

/**
 * Convert instance to a string.
 */
EventChange.prototype.toString = function () {
    let nrcEvent = this.nrcEvent;
    let eventString = `Event: ${nrcEvent.name}\n` +
        `Run date: ${nrcEvent.eventDate} ${nrcEvent.startDateTime}-${nrcEvent.endDateTime}`;
    switch (this.code) {
        case eventChangeCode.ALMOST_FULL:
            eventString = eventString + `\nFree slot: ${nrcEvent.capacity - nrcEvent.regCount}/${nrcEvent.capacity}\n` +
                `UPDATE: Almost full ლ(｀ー´ლ)`;
            break;
        case eventChangeCode.NEW:
            eventString = eventString + `\nOpen date: ${nrcEvent.regDate} ${nrcEvent.regDateTime}\n` +
                `UPDATE: New Event ε=ε=ε=┌(;^Д^)ﾉ`;
            break;
        case eventChangeCode.DELETED:
            eventString = eventString + `\nUPDATE: Deleted ¯\\_(ツ)_/¯`;
            break;
        case eventChangeCode.FREE_SLOT:
            eventString = eventString + `\nFree slot: ${nrcEvent.capacity - nrcEvent.regCount}/${nrcEvent.capacity}\n` +
                `UPDATE: Almost full ლ(｀ー´ლ)`;
            break;
        case eventChangeCode.FULL:
            eventString = eventString + `\nUPDATE: Full ᕙ(⇀‸↼‶)ᕗ`;
            break;
        default:
            eventString = eventString + `\nUnknown change code=${this.code} щ（ﾟДﾟщ）`;
            break;
    }
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