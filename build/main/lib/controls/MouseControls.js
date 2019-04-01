"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mustBeObject_1 = require("../checks/mustBeObject");
var ShareableBase_1 = require("../core/ShareableBase");
var Vector2_1 = require("../math/Vector2");
var MODE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };
/**
 * The index into the keys array is ROTATE=0, ZOOM=1, PAN=2
 */
var keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];
/**
 *
 */
var MouseControls = /** @class */ (function (_super) {
    tslib_1.__extends(MouseControls, _super);
    /**
     *
     * @param wnd
     */
    function MouseControls(wnd) {
        if (wnd === void 0) { wnd = window; }
        var _this = _super.call(this) || this;
        /**
         *
         * @default true
         */
        _this.enabled = true;
        /**
         *
         * @default false
         */
        _this.noRotate = false;
        /**
         *
         * @default false
         */
        _this.noZoom = false;
        /**
         *
         * @default false
         */
        _this.noPan = false;
        /**
         *
         * @default 0
         */
        _this.minDistance = 0;
        /**
         *
         * @default Infinity
         */
        _this.maxDistance = Infinity;
        /**
         * The mouse controls operate modally. You can only do one thing (rotate, zoom, or pan) at a time.
         */
        _this.mode = MODE.NONE;
        /**
         * Using the keyboard allows us to change modes, so we keep this so that we can revert.
         */
        _this.prevMode = MODE.NONE;
        /**
         *
         */
        _this.moveCurr = new Vector2_1.Vector2();
        /**
         *
         */
        _this.movePrev = new Vector2_1.Vector2();
        /**
         *
         */
        _this.zoomStart = new Vector2_1.Vector2();
        /**
         *
         */
        _this.zoomEnd = new Vector2_1.Vector2();
        /**
         *
         */
        _this.panStart = new Vector2_1.Vector2();
        /**
         *
         */
        _this.panEnd = new Vector2_1.Vector2();
        /**
         * Initialized by calling handleResize
         */
        _this.screenLoc = new Vector2_1.Vector2();
        /**
         * Think of this vector as running from the top left corner of the screen.
         */
        _this.circleExt = new Vector2_1.Vector2();
        /**
         * Think of this vector as running from the bottom left corner of the screen.
         */
        _this.screenExt = new Vector2_1.Vector2();
        _this.mouseOnCircle = new Vector2_1.Vector2();
        _this.mouseOnScreen = new Vector2_1.Vector2();
        _this.setLoggingName('MouseControls');
        _this.wnd = mustBeObject_1.mustBeObject('wnd', wnd);
        /**
         *
         */
        _this.mousedown = function (event) {
            if (!_this.enabled) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (_this.mode === MODE.NONE) {
                _this.mode = event.button;
            }
            if (_this.mode === MODE.ROTATE && !_this.noRotate) {
                _this.updateMouseOnCircle(event);
                _this.moveCurr.copy(_this.mouseOnCircle);
                _this.movePrev.copy(_this.mouseOnCircle);
            }
            else if (_this.mode === MODE.ZOOM && !_this.noZoom) {
                _this.updateMouseOnScreen(event);
                _this.zoomStart.copy(_this.mouseOnScreen);
                _this.zoomEnd.copy(_this.mouseOnScreen);
            }
            else if (_this.mode === MODE.PAN && !_this.noPan) {
                _this.updateMouseOnScreen(event);
                _this.panStart.copy(_this.mouseOnScreen);
                _this.panEnd.copy(_this.mouseOnScreen);
            }
            _this.wnd.document.addEventListener('mousemove', _this.mousemove, false);
            _this.wnd.document.addEventListener('mouseup', _this.mouseup, false);
        };
        /**
         *
         */
        _this.mousemove = function (event) {
            if (!_this.enabled) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (_this.mode === MODE.ROTATE && !_this.noRotate) {
                _this.movePrev.copy(_this.moveCurr);
                _this.updateMouseOnCircle(event);
                _this.moveCurr.copy(_this.mouseOnCircle);
            }
            else if (_this.mode === MODE.ZOOM && !_this.noZoom) {
                _this.updateMouseOnScreen(event);
                _this.zoomEnd.copy(_this.mouseOnScreen);
            }
            else if (_this.mode === MODE.PAN && !_this.noPan) {
                _this.updateMouseOnScreen(event);
                _this.panEnd.copy(_this.mouseOnScreen);
            }
        };
        /**
         *
         */
        _this.mouseup = function (event) {
            if (!_this.enabled) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            _this.mode = MODE.NONE;
            _this.wnd.document.removeEventListener('mousemove', _this.mousemove);
            _this.wnd.document.removeEventListener('mouseup', _this.mouseup);
        };
        /**
         *
         */
        _this.mousewheel = function (event) {
            if (!_this.enabled) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            var delta = 0;
            if (event['wheelDelta']) { // WebKit / Opera / Explorer 9
                delta = event['wheelDelta'] / 40;
            }
            else if (event.detail) { // Firefox
                delta = event.detail / 3;
            }
            _this.zoomStart.y += delta * 0.01;
        };
        /**
         *
         */
        _this.keydown = function (event) {
            if (!_this.enabled) {
                return;
            }
            _this.wnd.removeEventListener('keydown', _this.keydown, false);
            _this.prevMode = _this.mode;
            if (_this.mode !== MODE.NONE) {
                // If we are already in a mode then keydown can't change it.
                // The key must go down before the mouse causes us to enter a mode.
                return;
            }
            else if (event.keyCode === keys[MODE.ROTATE] && !_this.noRotate) {
                // Pressing 'A'...
                _this.mode = MODE.ROTATE;
            }
            else if (event.keyCode === keys[MODE.ZOOM] && !_this.noRotate) {
                // Pressing 'S'...
                _this.mode = MODE.ZOOM;
            }
            else if (event.keyCode === keys[MODE.PAN] && !_this.noRotate) {
                // Pressing 'D'...
                _this.mode = MODE.PAN;
            }
        };
        /**
         *
         */
        _this.keyup = function (event) {
            if (!_this.enabled) {
                return;
            }
            _this.mode = _this.prevMode;
            _this.wnd.addEventListener('keydown', _this.keydown, false);
        };
        return _this;
    }
    MouseControls.prototype.destructor = function (levelUp) {
        if (this.domElement) {
            this.unsubscribe();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     * Simulates a movement of the mouse in coordinates -1 to +1 in both directions.
     *
     * @param x
     * @param y
     */
    MouseControls.prototype.move = function (x, y) {
        this.moveCurr.x = x;
        this.moveCurr.y = y;
    };
    /**
     * @param domElement
     */
    MouseControls.prototype.subscribe = function (domElement) {
        if (this.domElement) {
            this.unsubscribe();
        }
        this.domElement = domElement;
        this.disableContextMenu();
        this.domElement.addEventListener('mousedown', this.mousedown, false);
        this.domElement.addEventListener('mousewheel', this.mousewheel, false);
        this.domElement.addEventListener('DOMMouseScroll', this.mousewheel, false); // Firefox
        this.wnd.addEventListener('keydown', this.keydown, false);
        this.wnd.addEventListener('keyup', this.keyup, false);
        this.handleResize();
    };
    /**
     *
     */
    MouseControls.prototype.unsubscribe = function () {
        if (this.domElement) {
            this.enableContextMenu();
            this.domElement.removeEventListener('mousedown', this.mousedown, false);
            this.domElement.removeEventListener('mousewheel', this.mousewheel, false);
            this.domElement.removeEventListener('DOMMouseScroll', this.mousewheel, false); // Firefox
            this.domElement = void 0;
            this.wnd.removeEventListener('keydown', this.keydown, false);
            this.wnd.removeEventListener('keyup', this.keyup, false);
        }
    };
    MouseControls.prototype.disableContextMenu = function () {
        if (this.domElement) {
            if (!this.contextmenu) {
                this.contextmenu = function (event) {
                    event.preventDefault();
                };
                this.domElement.addEventListener('contextmenu', this.contextmenu, false);
            }
        }
    };
    MouseControls.prototype.enableContextMenu = function () {
        if (this.domElement) {
            if (this.contextmenu) {
                this.domElement.removeEventListener('contextmenu', this.contextmenu, false);
                this.contextmenu = void 0;
            }
        }
    };
    /**
     *
     */
    MouseControls.prototype.reset = function () {
        this.mode = MODE.NONE;
    };
    /**
     * Computes coordinates in the range [-1,+1] in both e1 and e2 directions.
     * e1 goes to the RIGHT
     * e2 goes UP
     * Updates the mouseOnCircle property.
     *
     * @param mouse
     */
    MouseControls.prototype.updateMouseOnCircle = function (mouse) {
        this.mouseOnCircle.x = mouse.pageX;
        this.mouseOnCircle.y = -mouse.pageY;
        this.mouseOnCircle.sub(this.screenLoc).scale(2).sub(this.circleExt).divByScalar(this.circleExt.x);
    };
    /**
     * Computes coordinates in the range [0,1] in both e1 and e2 directions.
     * e1 goes to the RIGHT
     * e2 goes DOWN
     * Updates the mouseOnScreen property.
     *
     * @param mouse
     */
    MouseControls.prototype.updateMouseOnScreen = function (mouse) {
        this.mouseOnScreen.x = mouse.pageX;
        this.mouseOnScreen.y = -mouse.pageY;
        this.mouseOnScreen.sub(this.screenLoc);
        this.mouseOnScreen.x /= this.circleExt.x;
        this.mouseOnScreen.y /= this.circleExt.y;
    };
    /**
     * This should be called whenever the window is resized.
     */
    MouseControls.prototype.handleResize = function () {
        if (false /*this.domElement === document*/) {
            // this.screen.left = 0;
            // this.screen.top = 0;
            // this.screen.width = window.innerWidth;
            // this.screen.height = window.innerHeight;
        }
        else {
            var boundingRect = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            var domElement = this.domElement.ownerDocument.documentElement;
            this.screenLoc.x = boundingRect.left + window.pageXOffset - domElement.clientLeft;
            this.screenLoc.y = -(boundingRect.top + window.pageYOffset - domElement.clientTop);
            this.circleExt.x = boundingRect.width;
            this.circleExt.y = -boundingRect.height;
            this.screenExt.x = boundingRect.width;
            this.screenExt.y = boundingRect.height;
        }
    };
    return MouseControls;
}(ShareableBase_1.ShareableBase));
exports.MouseControls = MouseControls;
