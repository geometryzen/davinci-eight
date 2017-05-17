import { config } from '../config';
import { isDefined } from '../checks/isDefined';

let statistics: { [uuid: string]: { refCount: number; name: string; zombie: boolean } } = {};
let chatty = true;
let skip = true;
let trace = false;
let traceName: string = void 0;

const LOGGING_NAME_REF_CHANGE = 'refChange';

function prefix(message: string): string {
    return LOGGING_NAME_REF_CHANGE + ": " + message;
}

function log(message: string): void {
    return config.log(prefix(message));
}

function warn(message: string): void {
    return config.warn(prefix(message));
}

function error(message: string): void {
    return config.error(prefix(message));
}

function garbageCollect(): void {
    const uuids: string[] = Object.keys(statistics);
    uuids.forEach(function (uuid: string) {
        const element = statistics[uuid];
        if (element.refCount === 0) {
            delete statistics[uuid];
        }
    });
}

function computeOutstanding(): number {
    const uuids = Object.keys(statistics);
    const uuidsLength = uuids.length;
    let total = 0;
    for (let i = 0; i < uuidsLength; i++) {
        const uuid = uuids[i];
        const statistic = statistics[uuid];
        total += statistic.refCount;
    }
    return total;
}

function stop(): number {
    if (skip) {
        warn("Nothing to see because skip mode is " + skip);
    }
    garbageCollect();
    return computeOutstanding();
}

function outstandingMessage(outstanding: number): string {
    return `There are ${outstanding} outstanding reference counts.`;
}

function dump(): number {
    const outstanding: number = stop();
    if (outstanding > 0) {
        config.warn("Memory Leak!");
        config.warn(outstandingMessage(outstanding));
        config.warn(JSON.stringify(statistics, null, 2));
    }
    else {
        if (chatty) {
            config.log(outstandingMessage(outstanding));
        }
    }
    return outstanding;
}

export function refChange(uuid: string, name?: string, change = 0): number {
    if (change !== 0 && skip) {
        return void 0;
    }
    if (trace) {
        if (traceName) {
            if (name === traceName) {
                const element = statistics[uuid];
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
        let element = statistics[uuid];
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
        const element = statistics[uuid];
        if (element) {
            element.refCount += change;
            if (element.refCount === 0) {
                element.zombie = true;
            }
            else if (element.refCount < 0) {
                error(`refCount < 0 for ${name}`);
            }
        }
        else {
            error(change + " on " + uuid + " @ " + name);
        }
    }
    else if (change === 0) {
        // When the value of change is zero, the uuid is either a command or a method on an exisiting uuid.
        const message = isDefined(name) ? `${uuid} @ ${name}` : uuid;
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
                throw new Error(prefix(`Unexpected command uuid => ${uuid}, name => ${name}`));
            }
        }
    }
    else {
        throw new Error(prefix("change must be +1 or -1 for normal recording, or 0 for logging to the console."));
    }
    return void 0;
}
