let statistics: { [uuid: string]: { refCount: number; name: string; zombie: boolean } } = {};
let skip = true;
let trace: boolean = false;
let traceName: string = void 0;

// TODO: Very first time refChange is called, check count is +1
// FIXME: Use a better sentinel for command mode.

let LOGGING_NAME_REF_CHANGE = 'refChange';

function prefix(message: string): string {
  return LOGGING_NAME_REF_CHANGE + ": " + message;
}

function log(message: string) {
  return console.log(prefix(message));
}

function warn(message: string) {
  return console.warn(prefix(message));
}

function garbageCollect() {
  let uuids: string[] = Object.keys(statistics);
  uuids.forEach(function(uuid: string) {
    let element = statistics[uuid];
    if (element.refCount === 0) {
      delete statistics[uuid];
    }
  });
}

function computeOutstanding(): number {
  let uuids = Object.keys(statistics);
  let uuidsLength = uuids.length;
  var i: number;
  var total = 0;
  for (i = 0; i < uuidsLength; i++) {
    let uuid = uuids[i];
    let statistic = statistics[uuid];
    total += statistic.refCount;
  }
  return total;
}

function stop(): number {
  if (skip) {
    warn("Nothing to see because skip mode is " + skip);
  }
  garbageCollect();
  return  computeOutstanding();
}

function dump(): number {
  let outstanding: number = stop();
  if (outstanding > 0) {
    warn(JSON.stringify(statistics, null, 2));
  }
  else {
    log("There are " + outstanding + " outstanding reference counts.");
  }
  return outstanding;
}

function refChange(uuid: string, name?: string, change: number = 0): number {
  if (change !== 0 && skip) {
    return;
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
    let message = "" + uuid + " @ " + name;
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

export = refChange;