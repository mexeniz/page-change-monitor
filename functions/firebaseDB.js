var baseUrl = "/nrcEvents";
var db = null;

exports.setDBContext = (database) => {
    db = database;
}

exports.setBaseUrl = (newBaseUrl) => {
    baseUrl = newBaseUrl;
};

exports.getBaseUrl = () => {
    return baseUrl;
};

exports.getEvents = () => {
    if (!db) {
        throw new Error('Admin app is not initialized.')
    }
    return db.ref(baseUrl).once('value').then((snapshot) => {
        return snapshot.val();
    }).catch((error) => {
        console.error(error);
        return null;
    });
};

exports.getEvent = (eventId) => {
    if (!db) {
        throw new Error('Admin app is not initialized.')
    }
    return db.ref(baseUrl + '/' + eventId).once('value').then((snapshot) => {
        if (snapshot) {
            return snapshot.val();
        }else{
            return null;
        }
    });
};

exports.setEvent = (nrcEvent) => {
    if (!db) {
        throw new Error('Admin app is not initialized.')
    }
    var eventId = nrcEvent.id;
    return db.ref(baseUrl + '/' + eventId).set(nrcEvent.toJSON());
};

exports.setEvents = (nrcEventMap) => {
    if (!db) {
        throw new Error('Admin app is not initialized.')
    }
    return db.ref(baseUrl).set(nrcEventMap);
};

exports.removeEvent = (eventId) => {
    if (!db) {
        throw new Error('Admin app is not initialized.')
    }
    return db.ref(baseUrl + '/' + eventId).remove();
    // var eventId = nrcEvent.id;
    // return admin.database().ref(baseUrl + '/' + eventId).set(nrcEvent.toJSON());
};