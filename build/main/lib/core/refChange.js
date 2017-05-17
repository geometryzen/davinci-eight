"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var isDefined_1 = require("../checks/isDefined");
var statistics = {};
var chatty = true;
var skip = true;
var trace = false;
var traceName = void 0;
var LOGGING_NAME_REF_CHANGE = 'refChange';
function prefix(message) {
    return LOGGING_NAME_REF_CHANGE + ": " + message;
}
function log(message) {
    return config_1.config.log(prefix(message));
}
function warn(message) {
    return config_1.config.warn(prefix(message));
}
function error(message) {
    return config_1.config.error(prefix(message));
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
    var total = 0;
    for (var i = 0; i < uuidsLength; i++) {
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
function outstandingMessage(outstanding) {
    return "There are " + outstanding + " outstanding reference counts.";
}
function dump() {
    var outstanding = stop();
    if (outstanding > 0) {
        config_1.config.warn("Memory Leak!");
        config_1.config.warn(outstandingMessage(outstanding));
        config_1.config.warn(JSON.stringify(statistics, null, 2));
    }
    else {
        if (chatty) {
            config_1.config.log(outstandingMessage(outstanding));
        }
    }
    return outstanding;
}
function refChange(uuid, name, change) {
    if (change === void 0) { change = 0; }
    if (change !== 0 && skip) {
        return void 0;
    }
    if (trace) {
        if (traceName) {
            if (name === traceName) {
                var element = statistics[uuid];
                if (element) {
                    log(change + " on " + uuid + " @ " + name);
                }
                else {
                    log(change + " on " + uuid + " @ " + name);
                }
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
        else {
            // It's more efficient to synchronize the name than by using a change of zero.
            element.name = name;
        }
        element.refCount += change;
    }
    else if (change === -1) {
        var element = statistics[uuid];
        if (element) {
            element.refCount += change;
            if (element.refCount === 0) {
                element.zombie = true;
            }
            else if (element.refCount < 0) {
                error("refCount < 0 for " + name);
            }
        }
        else {
            error(change + " on " + uuid + " @ " + name);
        }
    }
    else if (change === 0) {
        // When the value of change is zero, the uuid is either a command or a method on an exisiting uuid.
        var message = isDefined_1.isDefined(name) ? uuid + " @ " + name : uuid;
        if (uuid === 'stop') {
            if (chatty) {
                log(message);
            }
            return stop();
        }
        else {
            if (uuid === 'dump') {
                return dump();
            }
            else if (uuid === 'verbose') {
                chatty = true;
            }
            else if (uuid === 'quiet') {
                chatty = false;
            }
            else if (uuid === 'start') {
                if (chatty) {
                    log(message);
                }
                skip = false;
                trace = false;
            }
            else if (uuid === 'reset') {
                if (chatty) {
                    log(message);
                }
                statistics = {};
                chatty = true;
                skip = true;
                trace = false;
                traceName = void 0;
            }
            else if (uuid === 'trace') {
                if (chatty) {
                    log(message);
                }
                skip = false;
                trace = true;
                traceName = name;
            }
            else {
                throw new Error(prefix("Unexpected command uuid => " + uuid + ", name => " + name));
            }
        }
    }
    else {
        throw new Error(prefix("change must be +1 or -1 for normal recording, or 0 for logging to the console."));
    }
    return void 0;
}
exports.refChange = refChange;
