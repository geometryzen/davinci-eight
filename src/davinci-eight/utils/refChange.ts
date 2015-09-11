let elements: { [uuid: string]: { refCount: number; name: string; zombie: boolean } } = {};
let skip = true;
let trace: boolean = false;
let traceName: string = void 0;

function garbageCollect() {
  let uuids: string[] = Object.keys(elements);
  uuids.forEach(function(uuid: string) {
    let element = elements[uuid];
    if (element.refCount === 0) {
      delete elements[uuid];
    }
  });
}

function dump() {
  if (skip) {
    console.warn("Nothing to see because skip mode is " + skip);
  }
  garbageCollect();
  console.log(JSON.stringify(elements, null, 2));
}
/**
 * Records reference count changes in a system-wide data structure.
 * A change is normally either +1 or -1.
 * a change of 0 is interpreted as a command in the uuid parameter and a context in the name.
 * Commands are:
 * 'dump'
 * 'reset'
 * 'skip'
 * 'trace'
 */
function refChange(uuid: string, change: number, name?: string) {
  if (change !== 0 && skip) {
    return;
  }
  if (trace) {
    if (traceName) {
      if (name === traceName) {
        console.log(change + " on " + uuid + " @ " + name);
      }
    }
    else {
      // trace everything
      console.log(change + " on " + uuid + " @ " + name);
    }
  }
  if (change === +1) {
    var element = elements[uuid];
    if (!element) {
      element = { refCount: 0, name: name, zombie: false };
      elements[uuid] = element;
    }
    element.refCount += change;
  }
  else if (change === -1) {
    var element = elements[uuid];
    element.refCount += change;
    if (element.refCount === 0) {
      element.zombie = true;
    }
  }
  else if (change === 0) {
    let message = "" + uuid + " @ " + name;
    console.log(message);
    if (uuid === 'dump') {
      dump();
    }
    else if (uuid === 'reset') {
      elements = {};
      skip = false;
      trace = false;
    }
    else if (uuid === 'skip') {
      elements = {};
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
      throw new Error("Unexpected command " + message);
    }
  }
  else {
    throw new Error("change must be +1 or -1 for normal recording, or 0 for logging to the console.");
  }
}

export = refChange;