var Eight = /** @class */ (function () {
    function Eight() {
        this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
        this.LAST_MODIFIED = '2019-03-31';
        this.NAMESPACE = 'EIGHT';
        this.VERSION = '7.3.2';
    }
    Eight.prototype.log = function (message) {
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    };
    Eight.prototype.info = function (message) {
        // This should allow us to unit test and run in environments without a console.
        console.log(message);
    };
    Eight.prototype.warn = function (message) {
        // This should allow us to unit test and run in environments without a console.
        console.warn(message);
    };
    Eight.prototype.error = function (message) {
        // This should allow us to unit test and run in environments without a console.
        console.error(message);
    };
    return Eight;
}());
export { Eight };
/**
 *
 */
export var config = new Eight();
