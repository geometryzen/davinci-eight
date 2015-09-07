var Texture = (function () {
    function Texture() {
        this._refCount = 1;
    }
    Texture.prototype.addRef = function () {
        this._refCount++;
        return this._refCount;
    };
    Texture.prototype.release = function () {
        this._refCount--;
        if (this._refCount === 0) {
            this.contextFree();
        }
        return this._refCount;
    };
    Texture.prototype.contextFree = function () {
        if (this._texture) {
            this._context.deleteTexture(this._texture);
            console.log("WebGLTexture deleted");
            this._texture = void 0;
        }
        this._context = void 0;
    };
    Texture.prototype.contextGain = function (context) {
        if (this._context !== context) {
            this.contextFree();
            this._context = context;
            this._texture = context.createTexture();
            console.log("WebGLTexture created");
        }
    };
    Texture.prototype.contextLoss = function () {
        this._texture = void 0;
        this._context = void 0;
    };
    /**
     * @method bind
     * @parameter target {number}
     */
    Texture.prototype.bind = function (target) {
        if (this._context) {
            this._context.bindTexture(target, this._texture);
        }
        else {
            console.warn("Texture.bind(target) missing WebGLRenderingContext.");
        }
    };
    return Texture;
})();
module.exports = Texture;
