define(["require", "exports"], function (require, exports) {
    var statistics = {};
    var skip = true;
    var trace = false;
    var traceName = void 0;
    // TODO: Very first time refChange is called, check count is +1
    // FIXME: Use a better sentinel for command mode.
    var LOGGING_NAME_REF_CHANGE = 'refChange';
    function prefix(message) {
        return LOGGING_NAME_REF_CHANGE + ": " + message;
    }
    function log(message) {
        return console.log(prefix(message));
    }
    function warn(message) {
        return console.warn(prefix(message));
    }
    function garbageCollect() {
        var uuids = Object.keys(statistics);
        uuids.forEach(function (uuid) {
            var element = statistics[uuid];
            if (element.refCount === 0) {
                delete statistics[uuid];
            }
        });
    }
    function computeOutstanding() {
        var uuids = Object.keys(statistics);
        var uuidsLength = uuids.length;
        var i;
        var total = 0;
        for (i = 0; i < uuidsLength; i++) {
            var uuid = uuids[i];
            var statistic = statistics[uuid];
            total += statistic.refCount;
        }
        return total;
    }
    function stop() {
        if (skip) {
            warn("Nothing to see because skip mode is " + skip);
        }
        garbageCollect();
        return computeOutstanding();
    }
    function dump() {
        var outstanding = stop();
        if (outstanding > 0) {
            warn(JSON.stringify(statistics, null, 2));
        }
        else {
            log("There are " + outstanding + " outstanding reference counts.");
        }
        return outstanding;
    }
    function refChange(uuid, name, change) {
        if (change === void 0) { change = 0; }
        if (change !== 0 && skip) {
            return;
        }
        if (trace) {
            if (traceName) {
                if (name === traceName) {
                    log(change + " on " + uuid + " @ " + name);
                }
            }
            else {
                // trace everything
                log(change + " on " + uuid + " @ " + name);
            }
        }
        if (change === +1) {
            var element = statistics[uuid];
            if (!element) {
                element = { refCount: 0, name: name, zombie: false };
                statistics[uuid] = element;
            }
            element.refCount += change;
        }
        else if (change === -1) {
            var element = statistics[uuid];
            element.refCount += change;
            if (element.refCount === 0) {
                element.zombie = true;
            }
        }
        else if (change === 0) {
            var message = "" + uuid + " @ " + name;
            log(message);
            if (uuid === 'stop') {
                return stop();
            }
            if (uuid === 'dump') {
                return dump();
            }
            else if (uuid === 'start') {
                skip = false;
                trace = false;
            }
            else if (uuid === 'reset') {
                statistics = {};
                skip = true;
                trace = false;
                traceName = void 0;
            }
            else if (uuid === 'trace') {
                skip = false;
                trace = true;
                traceName = name;
            }
            else {
                throw new Error(prefix("Unexpected command " + message));
            }
        }
        else {
            throw new Error(prefix("change must be +1 or -1 for normal recording, or 0 for logging to the console."));
        }
    }
    return refChange;
});
