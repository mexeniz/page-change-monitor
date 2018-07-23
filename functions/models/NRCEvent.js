function NRCEvent(id, name, capacity, regCount, location) {
    this.id = id;
    this.name  = name;
    this.capacity = capacity;
    this.regCount = regCount;
    this.location = location;
    // TODO(M): Defince instance functions here ...
}

NRCEvent.prototype.compare = function (event1, event2) {
    return 0;
}

NRCEvent.prototype.fromJSON = function (jsonEvent) {
    var {
        id,
        name,
        capacity,
        registrationCount,
        meetingPointDescription
    } = jsonEvent;
    return new NRCEvent(id, name, capacity, registrationCount, meetingPointDescription);
}

module.exports = NRCEvent;