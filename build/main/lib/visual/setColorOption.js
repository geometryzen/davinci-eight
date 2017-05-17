"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
function setColorOption(mesh, options, defaultColor) {
    if (isDefined_1.isDefined(options.color)) {
        mesh.color.copy(options.color);
    }
    else if (isDefined_1.isDefined(defaultColor)) {
        mesh.color.copy(defaultColor);
    }
}
exports.setColorOption = setColorOption;
