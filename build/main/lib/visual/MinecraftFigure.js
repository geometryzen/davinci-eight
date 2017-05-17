"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Group_1 = require("./Group");
var isBoolean_1 = require("../checks/isBoolean");
var isNumber_1 = require("../checks/isNumber");
var Minecraft_1 = require("./Minecraft");
var Minecraft_2 = require("./Minecraft");
var Minecraft_3 = require("./Minecraft");
var Minecraft_4 = require("./Minecraft");
var Minecraft_5 = require("./Minecraft");
var Minecraft_6 = require("./Minecraft");
var R3_1 = require("../math/R3");
var e1 = R3_1.vec(1, 0, 0);
var e2 = R3_1.vec(0, 1, 0);
/**
 * A group of body parts arranged to look like a figure.
 */
var MinecraftFigure = (function (_super) {
    tslib_1.__extends(MinecraftFigure, _super);
    function MinecraftFigure(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        var height = isNumber_1.isNumber(options.height) ? options.height : 1;
        var scale = height / 32;
        var oldSkinLayout = isBoolean_1.isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false;
        _this.head = new Minecraft_1.MinecraftHead(engine, texture, { height: height, offset: e2.scale(scale * 4), oldSkinLayout: oldSkinLayout });
        _this.head.position.zero().addVector(e2, scale * 24);
        _this.add(_this.head);
        _this.head.release();
        _this.torso = new Minecraft_6.MinecraftTorso(engine, texture, { height: height, oldSkinLayout: oldSkinLayout });
        _this.torso.position.zero().addVector(e2, scale * 18);
        _this.add(_this.torso);
        _this.torso.release();
        _this.armL = new Minecraft_2.MinecraftArmL(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.armL.position.zero().addVector(e2, scale * 22).addVector(e1, scale * 6);
        _this.add(_this.armL);
        _this.armL.release();
        _this.armR = new Minecraft_3.MinecraftArmR(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.armR.position.zero().addVector(e2, scale * 22).subVector(e1, scale * 6);
        _this.add(_this.armR);
        _this.armR.release();
        _this.legL = new Minecraft_4.MinecraftLegL(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.legL.position.zero().addVector(e2, scale * 10).addVector(e1, scale * 2);
        _this.add(_this.legL);
        _this.legL.release();
        _this.legR = new Minecraft_5.MinecraftLegR(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.legR.position.zero().addVector(e2, scale * 10).subVector(e1, scale * 2);
        _this.add(_this.legR);
        _this.legR.release();
        return _this;
    }
    return MinecraftFigure;
}(Group_1.Group));
exports.MinecraftFigure = MinecraftFigure;
