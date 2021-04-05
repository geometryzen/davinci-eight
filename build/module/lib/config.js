/**
 * @hidden
 */
var Eight = /** @class */ (function () {
    function Eight() {
        this.GITHUB = "https://github.com/geometryzen/davinci-eight";
        this.LAST_MODIFIED = "2021-04-04";
        this.MARKETING_NAME = "DaVinci eight";
        this.VERSION = "8.4.22";
    }
    Eight.prototype.log = function (message) {
        console.log(message);
    };
    Eight.prototype.info = function (message) {
        console.log(message);
    };
    Eight.prototype.warn = function (message) {
        console.warn(message);
    };
    Eight.prototype.error = function (message) {
        console.error(message);
    };
    return Eight;
}());
export { Eight };
/**
 * @hidden
 */
export var config = new Eight();
