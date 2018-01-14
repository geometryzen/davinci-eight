"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BeginMode_1 = require("../core/BeginMode");
var GeometryArrays_1 = require("../core/GeometryArrays");
var ImageTexture_1 = require("../core/ImageTexture");
var isBoolean_1 = require("../checks/isBoolean");
var isNumber_1 = require("../checks/isNumber");
var Mesh_1 = require("../core/Mesh");
var ShaderMaterial_1 = require("../materials/ShaderMaterial");
var MinecraftPartKind;
(function (MinecraftPartKind) {
    MinecraftPartKind[MinecraftPartKind["Head"] = 0] = "Head";
    MinecraftPartKind[MinecraftPartKind["Helm"] = 1] = "Helm";
    MinecraftPartKind[MinecraftPartKind["RightLeg"] = 2] = "RightLeg";
    MinecraftPartKind[MinecraftPartKind["Torso"] = 3] = "Torso";
    MinecraftPartKind[MinecraftPartKind["RightArm"] = 4] = "RightArm";
    MinecraftPartKind[MinecraftPartKind["LeftLeg"] = 5] = "LeftLeg";
    MinecraftPartKind[MinecraftPartKind["LeftArm"] = 6] = "LeftArm";
    MinecraftPartKind[MinecraftPartKind["RightLegLayer2"] = 7] = "RightLegLayer2";
    MinecraftPartKind[MinecraftPartKind["TorsoLayer2"] = 8] = "TorsoLayer2";
    MinecraftPartKind[MinecraftPartKind["RightArmLayer2"] = 9] = "RightArmLayer2";
    MinecraftPartKind[MinecraftPartKind["LeftLegLayer2"] = 10] = "LeftLegLayer2";
    MinecraftPartKind[MinecraftPartKind["LeftArmLayer2"] = 11] = "LeftArmLayer2";
})(MinecraftPartKind = exports.MinecraftPartKind || (exports.MinecraftPartKind = {}));
var MinecraftSide;
(function (MinecraftSide) {
    MinecraftSide[MinecraftSide["Top"] = 0] = "Top";
    MinecraftSide[MinecraftSide["Bottom"] = 1] = "Bottom";
    MinecraftSide[MinecraftSide["Right"] = 2] = "Right";
    MinecraftSide[MinecraftSide["Front"] = 3] = "Front";
    MinecraftSide[MinecraftSide["Left"] = 4] = "Left";
    MinecraftSide[MinecraftSide["Back"] = 5] = "Back";
})(MinecraftSide || (MinecraftSide = {}));
/**
 * The dimensions have been adjusted so that the total height of the figure is 1.
 */
function dimensions(part, height) {
    var LIMB_SIZE = 0.125 * height;
    var HEAD_SIZE = 0.25 * height;
    var TORSO_LENGTH = 0.375 * height;
    switch (part) {
        case MinecraftPartKind.Head: {
            return [HEAD_SIZE, HEAD_SIZE, HEAD_SIZE];
        }
        case MinecraftPartKind.Helm: {
            return [HEAD_SIZE, HEAD_SIZE, HEAD_SIZE];
        }
        case MinecraftPartKind.LeftLeg:
        case MinecraftPartKind.LeftLegLayer2:
        case MinecraftPartKind.RightLeg:
        case MinecraftPartKind.RightLegLayer2: {
            return [LIMB_SIZE, TORSO_LENGTH, LIMB_SIZE];
        }
        case MinecraftPartKind.Torso:
        case MinecraftPartKind.TorsoLayer2: {
            return [HEAD_SIZE, TORSO_LENGTH, LIMB_SIZE];
        }
        case MinecraftPartKind.LeftArm:
        case MinecraftPartKind.LeftArmLayer2:
        case MinecraftPartKind.RightArm:
        case MinecraftPartKind.RightArmLayer2: {
            return [LIMB_SIZE, TORSO_LENGTH, LIMB_SIZE];
        }
        default: {
            throw new Error("part: " + part);
        }
    }
}
function textureBounds(part, side, version, oldSkinLayout) {
    switch (part) {
        case MinecraftPartKind.Head: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [8, 0, 16, 8];
                }
                case MinecraftSide.Bottom: {
                    if (oldSkinLayout) {
                        return [16, 0, 24, 8];
                    }
                    else {
                        return [24, 8, 16, 0];
                    }
                }
                case MinecraftSide.Right: {
                    return [0, 8, 8, 16];
                }
                case MinecraftSide.Front: {
                    return [8, 8, 16, 16];
                }
                case MinecraftSide.Left: {
                    return [16, 8, 24, 16];
                }
                case MinecraftSide.Back: {
                    return [24, 8, 32, 16];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        case MinecraftPartKind.Helm: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [40, 0, 48, 8];
                }
                case MinecraftSide.Bottom: {
                    return [48, 0, 56, 8];
                }
                case MinecraftSide.Right: {
                    return [32, 8, 40, 16];
                }
                case MinecraftSide.Front: {
                    return [40, 8, 48, 16];
                }
                case MinecraftSide.Left: {
                    return [48, 8, 56, 16];
                }
                case MinecraftSide.Back: {
                    return [56, 8, 64, 16];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        case MinecraftPartKind.RightLeg: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [4, 16, 8, 20];
                }
                case MinecraftSide.Bottom: {
                    return [8, 16, 12, 20];
                }
                case MinecraftSide.Right: {
                    return [0, 20, 4, 32];
                }
                case MinecraftSide.Front: {
                    return [4, 20, 8, 32];
                }
                case MinecraftSide.Left: {
                    return [8, 20, 12, 32];
                }
                case MinecraftSide.Back: {
                    return [12, 20, 16, 32];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        case MinecraftPartKind.Torso: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [20, 16, 28, 20];
                }
                case MinecraftSide.Bottom: {
                    return [28, 16, 36, 20];
                }
                case MinecraftSide.Right: {
                    return [16, 20, 20, 32];
                }
                case MinecraftSide.Front: {
                    return [20, 20, 28, 32];
                }
                case MinecraftSide.Left: {
                    return [28, 20, 32, 32];
                }
                case MinecraftSide.Back: {
                    return [32, 20, 40, 32];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        case MinecraftPartKind.RightArm: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [44, 16, 48, 20];
                }
                case MinecraftSide.Bottom: {
                    return [48, 16, 52, 20];
                }
                case MinecraftSide.Right: {
                    return [40, 20, 44, 32];
                }
                case MinecraftSide.Front: {
                    return [44, 20, 48, 32];
                }
                case MinecraftSide.Left: {
                    return [48, 20, 52, 32];
                }
                case MinecraftSide.Back: {
                    return [52, 20, 56, 32];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        case MinecraftPartKind.LeftLeg: {
            if (version > 0) {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [20, 48, 24, 52];
                    }
                    case MinecraftSide.Bottom: {
                        return [24, 48, 28, 52];
                    }
                    case MinecraftSide.Right: {
                        return [16, 52, 20, 64];
                    }
                    case MinecraftSide.Front: {
                        return [20, 52, 24, 64];
                    }
                    case MinecraftSide.Left: {
                        return [24, 52, 28, 64];
                    }
                    case MinecraftSide.Back: {
                        return [28, 52, 32, 64];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            else {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [8, 16, 4, 20];
                    }
                    case MinecraftSide.Bottom: {
                        return [12, 16, 8, 20];
                    }
                    case MinecraftSide.Right: {
                        return [12, 20, 8, 32];
                    }
                    case MinecraftSide.Front: {
                        return [8, 20, 4, 32];
                    }
                    case MinecraftSide.Left: {
                        return [4, 20, 0, 32];
                    }
                    case MinecraftSide.Back: {
                        return [16, 20, 12, 32];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
        }
        case MinecraftPartKind.LeftArm: {
            if (version > 0) {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [36, 48, 40, 52];
                    }
                    case MinecraftSide.Bottom: {
                        return [40, 48, 44, 52];
                    }
                    case MinecraftSide.Right: {
                        return [32, 52, 36, 64];
                    }
                    case MinecraftSide.Front: {
                        return [36, 52, 40, 64];
                    }
                    case MinecraftSide.Left: {
                        return [40, 52, 44, 64];
                    }
                    case MinecraftSide.Back: {
                        return [44, 52, 48, 64];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
            else {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [48, 16, 44, 20];
                    }
                    case MinecraftSide.Bottom: {
                        return [52, 16, 48, 20];
                    }
                    case MinecraftSide.Right: {
                        return [52, 20, 48, 32];
                    }
                    case MinecraftSide.Front: {
                        return [48, 20, 44, 32];
                    }
                    case MinecraftSide.Left: {
                        return [44, 20, 40, 32];
                    }
                    case MinecraftSide.Back: {
                        return [56, 20, 52, 32];
                    }
                    default: {
                        throw new Error("" + side);
                    }
                }
            }
        }
        case MinecraftPartKind.RightLegLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [4, 48, 8, 36];
                }
                case MinecraftSide.Bottom: {
                    return [8, 48, 12, 36];
                }
                case MinecraftSide.Right: {
                    return [0, 36, 4, 48];
                }
                case MinecraftSide.Front: {
                    return [4, 36, 8, 48];
                }
                case MinecraftSide.Left: {
                    return [8, 36, 12, 48];
                }
                case MinecraftSide.Back: {
                    return [12, 36, 16, 48];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        case MinecraftPartKind.TorsoLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [20, 48, 28, 36];
                }
                case MinecraftSide.Bottom: {
                    return [28, 48, 36, 36];
                }
                case MinecraftSide.Right: {
                    return [16, 36, 20, 48];
                }
                case MinecraftSide.Front: {
                    return [20, 36, 28, 48];
                }
                case MinecraftSide.Left: {
                    return [28, 36, 32, 48];
                }
                case MinecraftSide.Back: {
                    return [32, 36, 40, 48];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        case MinecraftPartKind.RightArmLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [44, 48, 48, 36];
                }
                case MinecraftSide.Bottom: {
                    return [48, 48, 52, 36];
                }
                case MinecraftSide.Right: {
                    return [40, 36, 44, 48];
                }
                case MinecraftSide.Front: {
                    return [44, 36, 48, 48];
                }
                case MinecraftSide.Left: {
                    return [48, 36, 52, 48];
                }
                case MinecraftSide.Back: {
                    return [52, 36, 64, 48];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        case MinecraftPartKind.LeftLegLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [4, 48, 8, 52];
                }
                case MinecraftSide.Bottom: {
                    return [8, 48, 12, 52];
                }
                case MinecraftSide.Right: {
                    return [0, 52, 4, 64];
                }
                case MinecraftSide.Front: {
                    return [4, 52, 8, 64];
                }
                case MinecraftSide.Left: {
                    return [8, 52, 12, 64];
                }
                case MinecraftSide.Back: {
                    return [12, 52, 16, 64];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        case MinecraftPartKind.LeftArmLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [52, 48, 56, 52];
                }
                case MinecraftSide.Bottom: {
                    return [56, 48, 60, 52];
                }
                case MinecraftSide.Right: {
                    return [48, 52, 52, 64];
                }
                case MinecraftSide.Front: {
                    return [52, 52, 56, 64];
                }
                case MinecraftSide.Left: {
                    return [56, 52, 60, 64];
                }
                case MinecraftSide.Back: {
                    return [60, 52, 64, 64];
                }
                default: {
                    throw new Error("" + side);
                }
            }
        }
        default: {
            throw new Error("part: " + part);
        }
    }
}
function aCoords(part, side, width, height, oldSkinLayout) {
    var cs = textureBounds(part, side, version(width, height), oldSkinLayout);
    var x1 = cs[0] / width;
    var y1 = cs[1] / height;
    var x2 = cs[2] / width;
    var y2 = cs[3] / height;
    return [x1, y2, x2, y2, x1, y1, x2, y2, x2, y1, x1, y1];
}
function version(width, height) {
    if (width === 2 * height) {
        return 0;
    }
    else if (width === height) {
        return 1.8;
    }
    else {
        // Fallback to zero for greatest compatibility.
        return 0;
    }
}
function primitiveFromOptions(texture, options) {
    var partKind = options.partKind;
    var offset = options.offset ? options.offset : { x: 0, y: 0, z: 0 };
    var dims = dimensions(partKind, options.height);
    var positions = [
        // Front
        [-0.5, -0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, +0.5, +0.5],
        [+0.5, -0.5, +0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5],
        // Back
        [+0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, +0.5, -0.5],
        [-0.5, -0.5, -0.5], [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5],
        // Left
        [+0.5, -0.5, +0.5], [+0.5, -0.5, -0.5], [+0.5, +0.5, +0.5],
        [+0.5, -0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5],
        // Right
        [-0.5, -0.5, -0.5], [-0.5, -0.5, +0.5], [-0.5, +0.5, -0.5],
        [-0.5, -0.5, +0.5], [-0.5, +0.5, +0.5], [-0.5, +0.5, -0.5],
        // Top
        [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, -0.5],
        [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5],
        // Bottom
        [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [-0.5, -0.5, +0.5],
        [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5]
    ]
        .map(function (xs) { return [dims[0] * xs[0], dims[1] * xs[1], dims[2] * xs[2]]; })
        .map(function (xs) { return [xs[0] + offset.x, xs[1] + offset.y, xs[2] + offset.z]; })
        .reduce(function (a, b) { return a.concat(b); });
    var naturalWidth = texture instanceof ImageTexture_1.ImageTexture ? texture.naturalWidth : 64;
    var naturalHeight = texture instanceof ImageTexture_1.ImageTexture ? texture.naturalHeight : 64;
    var naturalScale = 64 / naturalWidth;
    var width = naturalWidth * naturalScale;
    var height = naturalHeight * naturalScale;
    var oldSkinLayout = options.oldSkinLayout;
    var coords = [
        aCoords(partKind, MinecraftSide.Front, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Back, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Left, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Right, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Top, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Bottom, width, height, oldSkinLayout)
    ].reduce(function (a, b) { return a.concat(b); });
    var primitive = {
        mode: BeginMode_1.BeginMode.TRIANGLES,
        attributes: {
            aPosition: { values: positions, size: 3 },
            aCoords: { values: coords, size: 2 }
        }
    };
    return primitive;
}
function makeGeometry(graphics, texture, options) {
    return new GeometryArrays_1.GeometryArrays(graphics, primitiveFromOptions(texture, options));
}
var vs = [
    'attribute vec3 aPosition;',
    'attribute vec2 aCoords;',
    'uniform mat4 uModel;',
    'uniform mat4 uProjection;',
    'uniform mat4 uView;',
    'varying highp vec2 vCoords;',
    'void main(void) {',
    '  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);',
    '  vCoords = aCoords;',
    '}'
].join('\n');
var fs = [
    'precision mediump float;',
    'varying highp vec2 vCoords;',
    'uniform sampler2D uImage;',
    '  void main(void) {',
    '  gl_FragColor = texture2D(uImage, vec2(vCoords.s, vCoords.t));',
    '}'
].join('\n');
var makeMaterial = function makeMaterial(graphics) {
    return new ShaderMaterial_1.ShaderMaterial(vs, fs, [], graphics);
};
/**
 *
 */
var MinecraftBodyPart = /** @class */ (function (_super) {
    tslib_1.__extends(MinecraftBodyPart, _super);
    function MinecraftBodyPart(engine, texture, options, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, engine, {}, levelUp + 1) || this;
        _this.setLoggingName('MinecraftBodyPart');
        var geometry = makeGeometry(engine, texture, options);
        _this.geometry = geometry;
        geometry.release();
        var material = makeMaterial(engine);
        _this.material = material;
        material.release();
        _this.texture = texture;
        return _this;
    }
    MinecraftBodyPart.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftBodyPart;
}(Mesh_1.Mesh));
exports.MinecraftBodyPart = MinecraftBodyPart;
var MinecraftHead = /** @class */ (function (_super) {
    tslib_1.__extends(MinecraftHead, _super);
    function MinecraftHead(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber_1.isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.Head,
            offset: options.offset,
            oldSkinLayout: isBoolean_1.isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftHead');
        return _this;
    }
    MinecraftHead.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftHead;
}(MinecraftBodyPart));
exports.MinecraftHead = MinecraftHead;
var MinecraftTorso = /** @class */ (function (_super) {
    tslib_1.__extends(MinecraftTorso, _super);
    function MinecraftTorso(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber_1.isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.Torso,
            offset: options.offset,
            oldSkinLayout: isBoolean_1.isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftTorso');
        return _this;
    }
    MinecraftTorso.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftTorso;
}(MinecraftBodyPart));
exports.MinecraftTorso = MinecraftTorso;
var MinecraftArmL = /** @class */ (function (_super) {
    tslib_1.__extends(MinecraftArmL, _super);
    function MinecraftArmL(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber_1.isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.LeftArm,
            offset: options.offset,
            oldSkinLayout: isBoolean_1.isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftArmL');
        return _this;
    }
    MinecraftArmL.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftArmL;
}(MinecraftBodyPart));
exports.MinecraftArmL = MinecraftArmL;
var MinecraftArmR = /** @class */ (function (_super) {
    tslib_1.__extends(MinecraftArmR, _super);
    function MinecraftArmR(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber_1.isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.RightArm,
            offset: options.offset,
            oldSkinLayout: isBoolean_1.isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftArmR');
        return _this;
    }
    MinecraftArmR.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftArmR;
}(MinecraftBodyPart));
exports.MinecraftArmR = MinecraftArmR;
var MinecraftLegL = /** @class */ (function (_super) {
    tslib_1.__extends(MinecraftLegL, _super);
    function MinecraftLegL(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber_1.isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.LeftLeg,
            offset: options.offset,
            oldSkinLayout: isBoolean_1.isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftLegL');
        return _this;
    }
    MinecraftLegL.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftLegL;
}(MinecraftBodyPart));
exports.MinecraftLegL = MinecraftLegL;
var MinecraftLegR = /** @class */ (function (_super) {
    tslib_1.__extends(MinecraftLegR, _super);
    function MinecraftLegR(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, engine, texture, {
            height: isNumber_1.isNumber(options.height) ? options.height : 1,
            partKind: MinecraftPartKind.RightLeg,
            offset: options.offset,
            oldSkinLayout: isBoolean_1.isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        }) || this;
        _this.setLoggingName('MinecraftLegR');
        return _this;
    }
    MinecraftLegR.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MinecraftLegR;
}(MinecraftBodyPart));
exports.MinecraftLegR = MinecraftLegR;
