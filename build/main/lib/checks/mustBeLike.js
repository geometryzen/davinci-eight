"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustBeLike = void 0;
var mustHaveOwnProperty_1 = require("./mustHaveOwnProperty");
function mustBeLike(name, value, duck, contextBuilder) {
    var props = Object.keys(duck);
    for (var i = 0, iLength = props.length; i < iLength; i++) {
        mustHaveOwnProperty_1.mustHaveOwnProperty(name, value, props[i], contextBuilder);
    }
    return value;
}
exports.mustBeLike = mustBeLike;
