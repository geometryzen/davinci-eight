define(["require", "exports"], function (require, exports) {
    var Eight = (function () {
        function Eight() {
            this.fastPath = false;
            this.strict = false;
            this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
            this.LAST_MODIFIED = '2016-02-11';
            this.NAMESPACE = 'EIGHT';
            this.verbose = false;
            this.VERSION = '2.183.0';
            this.logging = {};
        }
        return Eight;
    })();
    var core = new Eight();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = core;
});
