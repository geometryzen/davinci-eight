var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable_1) {
    var DirectorKeyboardHandler = (function (_super) {
        __extends(DirectorKeyboardHandler, _super);
        function DirectorKeyboardHandler(director) {
            _super.call(this, 'DirectorKeyboardHandler');
            this.director = director;
            this.director.addRef();
        }
        DirectorKeyboardHandler.prototype.destructor = function () {
            this.director.release();
            this.director = void 0;
            _super.prototype.destructor.call(this);
        };
        DirectorKeyboardHandler.prototype.keyDown = function (event) {
        };
        DirectorKeyboardHandler.prototype.keyUp = function (event) {
            switch (event.keyCode) {
                case 37:
                    {
                        this.director.backward();
                    }
                    break;
                case 39: {
                    this.director.forward();
                }
                default: {
                }
            }
        };
        return DirectorKeyboardHandler;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DirectorKeyboardHandler;
});
