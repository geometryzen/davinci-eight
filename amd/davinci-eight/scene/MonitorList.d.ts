import ContextListener = require('../core/ContextListener');
import ContextMonitor = require('../core/ContextMonitor');
/**
 * Implementation Only.
 */
declare class MonitorList {
    private monitors;
    constructor(monitors?: ContextMonitor[]);
    addContextListener(user: ContextListener): void;
    push(monitor: ContextMonitor): void;
    removeContextListener(user: ContextListener): void;
    toArray(): ContextMonitor[];
    static copy(monitors: ContextMonitor[]): MonitorList;
    static isInstanceOf(candidate: any): boolean;
    static assertInstance(name: string, candidate: MonitorList, contextBuilder: () => string): MonitorList;
    static verify(name: string, monitors: ContextMonitor[], contextBuilder?: () => string): ContextMonitor[];
    static addContextListener(user: ContextListener, monitors: ContextMonitor[]): void;
    static removeContextListener(user: ContextListener, monitors: ContextMonitor[]): void;
}
export = MonitorList;
