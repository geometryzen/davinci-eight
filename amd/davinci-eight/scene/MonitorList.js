define(["require", "exports", '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, mustSatisfy, isInteger) {
    function beInstanceOfContextMonitors() {
        return "be an instance of MonitorList";
    }
    function beContextMonitorArray() {
        return "be ContextMonitor[]";
    }
    function identity(monitor) {
        return monitor;
    }
    var METHOD_ADD = 'addContextListener';
    var METHOD_REMOVE = 'removeContextListener';
    /**
     * Implementation Only.
     */
    var MonitorList = (function () {
        function MonitorList(monitors) {
            if (monitors === void 0) { monitors = []; }
            this.monitors = monitors.map(identity);
        }
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
                mustSatisfy(name, false, beInstanceOfContextMonitors, contextBuilder);
                throw new Error();
            }
        };
        MonitorList.verify = function (name, monitors, contextBuilder) {
            mustSatisfy(name, isInteger(monitors['length']), beContextMonitorArray, contextBuilder);
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
        return MonitorList;
    })();
    return MonitorList;
});
