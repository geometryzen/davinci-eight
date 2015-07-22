var ViewportArgs = (function () {
    function ViewportArgs(x, y, width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.modified = false;
    }
    return ViewportArgs;
})();
module.exports = ViewportArgs;
