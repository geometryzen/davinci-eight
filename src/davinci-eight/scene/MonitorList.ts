import ContextListener = require('../core/ContextListener');
import ContextMonitor = require('../core/ContextMonitor');
import mustHaveOwnProperty = require('../checks/mustHaveOwnProperty');
import mustSatisfy = require('../checks/mustSatisfy');
import isInteger = require('../checks/isInteger');

function beInstanceOfContextMonitors() {
  return "be an instance of MonitorList";
}

function beContextMonitorArray() {
  return "be ContextMonitor[]";
}

function identity(monitor: ContextMonitor): ContextMonitor {
  return monitor;
}

let METHOD_ADD    = 'addContextListener';
let METHOD_REMOVE = 'removeContextListener';

/**
 * Implementation Only.
 */
class MonitorList {
  private monitors: ContextMonitor[];
  constructor(monitors: ContextMonitor[] = []) {
    this.monitors = monitors.map(identity);
  }
  addContextListener(user: ContextListener) {
    this.monitors.forEach(function(monitor){
      monitor.addContextListener(user);
    });
  }
  push(monitor: ContextMonitor): void {
    this.monitors.push(monitor);
  }
  removeContextListener(user: ContextListener) {
    this.monitors.forEach(function(monitor){
      monitor.removeContextListener(user);
    });
  }
  toArray(): ContextMonitor[] {
    return this.monitors.map(identity);
  }
  public static copy(monitors: ContextMonitor[]): MonitorList {
    return new MonitorList(monitors);
  }
  public static isInstanceOf(candidate: any): boolean {
    return candidate instanceof MonitorList;
  }
  public static assertInstance(name: string, candidate: MonitorList, contextBuilder: () => string): MonitorList {
    if (MonitorList.isInstanceOf(candidate)) {
      return candidate;
    }
    else {
      mustSatisfy(name, false, beInstanceOfContextMonitors, contextBuilder);
      throw new Error()
    }
  }
  public static verify(name: string, monitors: ContextMonitor[], contextBuilder?: () => string): ContextMonitor[] {
    mustSatisfy(name, isInteger(monitors['length']), beContextMonitorArray, contextBuilder);
    let monitorsLength: number = monitors.length;
    for (var i = 0; i < monitorsLength; i++) {
//      let monitor = monitors[i];
//      mustHaveOwnProperty(name, monitor, METHOD_ADD, contextBuilder);
//      mustHaveOwnProperty(name, monitor, METHOD_REMOVE, contextBuilder);
    }
    return monitors;
  }
  public static addContextListener(user: ContextListener, monitors: ContextMonitor[]) {
    MonitorList.verify('monitors', monitors, () => { return 'MonitorList.addContextListener'; });
    monitors.forEach(function(monitor){
      monitor.addContextListener(user);
    });
  }
  public static removeContextListener(user: ContextListener, monitors: ContextMonitor[]) {
    MonitorList.verify('monitors', monitors, () => { return 'MonitorList.removeContextListener'; });
    monitors.forEach(function(monitor){
      monitor.removeContextListener(user);
    });
  }
}

export = MonitorList;
