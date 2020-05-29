"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrolled = void 0;
function domElement() {
    var documentElement = document.documentElement;
    if (documentElement) {
        return documentElement;
    }
    else {
        var body = document.body;
        var html = body.parentNode;
        if (html) {
            return html;
        }
        else {
            return body;
        }
    }
}
/**
 * A cross-browser compatible, geometric, implementation of scrollX and scrollY.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX
 */
function scrolled(out) {
    out.a = 0;
    out.b = 0;
    if (window.pageXOffset !== void 0 && window.pageYOffset !== void 0) {
        out.x = window.pageXOffset;
        out.y = window.pageYOffset;
    }
    else {
        var domE = domElement();
        out.x = domE.scrollLeft;
        out.y = domE.scrollTop;
    }
}
exports.scrolled = scrolled;
