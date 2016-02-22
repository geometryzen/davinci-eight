define(["require", "exports"], function (require, exports) {
    var Eight = (function () {
        function Eight() {
            this.safemode = true;
            this.strict = false;
            this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
            this.LAST_MODIFIED = '2016-02-22';
            this.NAMESPACE = 'EIGHT';
            this.verbose = false;
            this.VERSION = '2.195.0';
            this.logging = {};
        }
        return Eight;
    })();
    var core = new Eight();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = core;
});
