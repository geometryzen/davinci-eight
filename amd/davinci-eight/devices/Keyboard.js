var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable_1) {
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
        __extends(Keyboard, _super);
        function Keyboard(handler, document) {
            if (document === void 0) { document = window.document; }
            _super.call(this, 'Keyboard');
            this.currentlyPressedKeys = [];
            this.attach(handler, document);
        }
        Keyboard.prototype.destructor = function () {
            this.detach();
            _super.prototype.destructor.call(this);
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
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Keyboard;
});
