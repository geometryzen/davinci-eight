import IContextConsumer = require('../core/IContextConsumer');
import IContextMonitor = require('../core/IContextMonitor');
import Shareable = require('../utils/Shareable');
/**
 * Implementation Only.
 */
declare class MonitorList extends Shareable {
    private monitors;
    constructor(monitors?: IContextMonitor[]);
    protected destructor(): void;
    addContextListener(user: IContextConsumer): void;
    push(monitor: IContextMonitor): void;
    removeContextListener(user: IContextConsumer): void;
    synchronize(user: IContextConsumer): void;
    toArray(): IContextMonitor[];
    static copy(monitors: IContextMonitor[]): MonitorList;
    static isInstanceOf(candidate: any): boolean;
    static assertInstance(name: string, candidate: MonitorList, contextBuilder: () => string): MonitorList;
    static verify(name: string, monitors: IContextMonitor[], contextBuilder?: () => string): IContextMonitor[];
    static addContextListener(user: IContextConsumer, monitors: IContextMonitor[]): void;
    static removeContextListener(user: IContextConsumer, monitors: IContextMonitor[]): void;
    static synchronize(user: IContextConsumer, monitors: IContextMonitor[]): void;
}
export = MonitorList;
