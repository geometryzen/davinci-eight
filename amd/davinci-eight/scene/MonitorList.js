var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable', '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, Shareable_1, mustSatisfy_1, isInteger_1) {
    function beInstanceOfContextMonitors() {
        return "be an instance of MonitorList";
    }
    function beContextMonitorArray() {
        return "be IContextMonitor[]";
    }
    function identity(monitor) {
        return monitor;
    }
    var MonitorList = (function (_super) {
        __extends(MonitorList, _super);
        function MonitorList(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, 'MonitorList');
            this.monitors = monitors.map(identity);
            this.monitors.forEach(function (monitor) {
                monitor.addRef();
            });
        }
        MonitorList.prototype.destructor = function () {
            this.monitors.forEach(function (monitor) {
                monitor.release();
            });
        };
        MonitorList.prototype.addContextListener = function (user) {
            this.monitors.forEach(function (monitor) {
                monitor.addContextListener(user);
            });
        };
        MonitorList.prototype.push = function (monitor) {
            this.monitors.push(monitor);
        };
        MonitorList.prototype.removeContextListener = function (user) {
            this.monitors.forEach(function (monitor) {
                monitor.removeContextListener(user);
            });
        };
        MonitorList.prototype.synchronize = function (user) {
            this.monitors.forEach(function (monitor) {
                monitor.synchronize(user);
            });
        };
        MonitorList.prototype.toArray = function () {
            return this.monitors.map(identity);
        };
        MonitorList.copy = function (monitors) {
            return new MonitorList(monitors);
        };
        MonitorList.isInstanceOf = function (candidate) {
            return candidate instanceof MonitorList;
        };
        MonitorList.assertInstance = function (name, candidate, contextBuilder) {
            if (MonitorList.isInstanceOf(candidate)) {
                return candidate;
            }
            else {
                mustSatisfy_1.default(name, false, beInstanceOfContextMonitors, contextBuilder);
                throw new Error();
            }
        };
        MonitorList.verify = function (name, monitors, contextBuilder) {
            mustSatisfy_1.default(name, isInteger_1.default(monitors['length']), beContextMonitorArray, contextBuilder);
            var monitorsLength = monitors.length;
            for (var i = 0; i < monitorsLength; i++) {
            }
            return monitors;
        };
        MonitorList.addContextListener = function (user, monitors) {
            MonitorList.verify('monitors', monitors, function () { return 'MonitorList.addContextListener'; });
            monitors.forEach(function (monitor) {
                monitor.addContextListener(user);
            });
        };
        MonitorList.removeContextListener = function (user, monitors) {
            MonitorList.verify('monitors', monitors, function () { return 'MonitorList.removeContextListener'; });
            monitors.forEach(function (monitor) {
                monitor.removeContextListener(user);
            });
        };
        MonitorList.synchronize = function (user, monitors) {
            MonitorList.verify('monitors', monitors, function () { return 'MonitorList.removeContextListener'; });
            monitors.forEach(function (monitor) {
                monitor.synchronize(user);
            });
        };
        return MonitorList;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MonitorList;
});
