import * as tslib_1 from "tslib";
import { ShareableBase } from '../core/ShareableBase';
function makeKeyDownHandler(keyboard, handler) {
    return function (event) {
        keyboard.currentlyPressedKeys[event.keyCode] = true;
        handler.keyDown(event);
    };
}
function makeKeyUpHandler(keyboard, handler) {
    return function (event) {
        keyboard.currentlyPressedKeys[event.keyCode] = false;
        handler.keyUp(event);
    };
}
var Keyboard = (function (_super) {
    tslib_1.__extends(Keyboard, _super);
    function Keyboard(handler, document) {
        if (document === void 0) { document = window.document; }
        var _this = _super.call(this) || this;
        _this.currentlyPressedKeys = [];
        _this.setLoggingName('Keyboard');
        _this.attach(handler, document);
        return _this;
    }
    Keyboard.prototype.destructor = function (levelUp) {
        this.detach();
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Keyboard.prototype.attach = function (handler, document, useCapture) {
        if (document === void 0) { document = window.document; }
        if (this.document !== document) {
            this.detach();
            this.handler = handler;
            this.handler.addRef();
            this.document = document;
            this.useCapture = useCapture;
            this.keyDownHandler = makeKeyDownHandler(this, handler);
            this.keyUpHandler = makeKeyUpHandler(this, handler);
            this.document.addEventListener('keydown', this.keyDownHandler, useCapture);
            this.document.addEventListener('keyup', this.keyUpHandler, useCapture);
        }
    };
    Keyboard.prototype.detach = function () {
        if (this.document) {
            this.document.removeEventListener('keydown', this.keyDownHandler, this.useCapture);
            this.document.removeEventListener('keyup', this.keyUpHandler, this.useCapture);
            this.handler.release();
            this.handler = void 0;
            this.document = void 0;
            this.useCapture = void 0;
            this.keyDownHandler = void 0;
            this.keyUpHandler = void 0;
        }
    };
    return Keyboard;
}(ShareableBase));
export { Keyboard };
