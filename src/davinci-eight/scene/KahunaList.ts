import IContextConsumer = require('../core/IContextConsumer');
import ContextController = require('../core/ContextController');
import ContextKahuna = require('../core/ContextKahuna');
import IContextMonitor = require('../core/IContextMonitor');
import mustSatisfy = require('../checks/mustSatisfy');

function beInstanceOfContextMonitors() {
  return "be an instance of KahunaList";
}

/**
 * Implementation Only.
 */
class KahunaList {
  private monitors: ContextKahuna[] = [];
  constructor() {
  }
  addContextListener(user: IContextConsumer) {
    this.monitors.forEach(function(monitor){
      monitor.addContextListener(user);
    });
  }
  push(monitor: ContextKahuna): void {
    this.monitors.push(monitor);
  }
  removeContextListener(user: IContextConsumer) {
    this.monitors.forEach(function(monitor){
      monitor.removeContextListener(user);
    });
  }
  start(): void {
    this.monitors.forEach(function(monitor){
      monitor.start();
    });
  }
  stop(): void {
    this.monitors.forEach(function(monitor){
      monitor.stop();
    });
  }
  public static isInstanceOf(candidate: any): boolean {
    return candidate instanceof KahunaList;
  }
  public static assertInstance(name: string, candidate: KahunaList, contextBuilder: () => string): KahunaList {
    if (KahunaList.isInstanceOf(candidate)) {
      return candidate;
    }
    else {
      mustSatisfy(name, false, beInstanceOfContextMonitors, contextBuilder);
      throw new Error()
    }
  }
}

export = KahunaList;
