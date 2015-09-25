import IContextConsumer = require('../core/IContextConsumer');
import ContextMonitor = require('../core/ContextMonitor');
/**
 * Implementation Only.
 */
declare class MonitorList {
    private monitors;
    constructor(monitors?: ContextMonitor[]);
    addContextListener(user: IContextConsumer): void;
    push(monitor: ContextMonitor): void;
    removeContextListener(user: IContextConsumer): void;
    synchronize(user: IContextConsumer): void;
    toArray(): ContextMonitor[];
    static copy(monitors: ContextMonitor[]): MonitorList;
    static isInstanceOf(candidate: any): boolean;
    static assertInstance(name: string, candidate: MonitorList, contextBuilder: () => string): MonitorList;
    static verify(name: string, monitors: ContextMonitor[], contextBuilder?: () => string): ContextMonitor[];
    static addContextListener(user: IContextConsumer, monitors: ContextMonitor[]): void;
    static removeContextListener(user: IContextConsumer, monitors: ContextMonitor[]): void;
    static synchronize(user: IContextConsumer, monitors: ContextMonitor[]): void;
}
export = MonitorList;
