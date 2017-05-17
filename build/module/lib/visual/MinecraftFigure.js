import * as tslib_1 from "tslib";
import { Group } from './Group';
import { isBoolean } from '../checks/isBoolean';
import { isNumber } from '../checks/isNumber';
import { MinecraftHead } from './Minecraft';
import { MinecraftArmL } from './Minecraft';
import { MinecraftArmR } from './Minecraft';
import { MinecraftLegL } from './Minecraft';
import { MinecraftLegR } from './Minecraft';
import { MinecraftTorso } from './Minecraft';
import { vec } from '../math/R3';
var e1 = vec(1, 0, 0);
var e2 = vec(0, 1, 0);
/**
 * A group of body parts arranged to look like a figure.
 */
var MinecraftFigure = (function (_super) {
    tslib_1.__extends(MinecraftFigure, _super);
    function MinecraftFigure(engine, texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        var height = isNumber(options.height) ? options.height : 1;
        var scale = height / 32;
        var oldSkinLayout = isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false;
        _this.head = new MinecraftHead(engine, texture, { height: height, offset: e2.scale(scale * 4), oldSkinLayout: oldSkinLayout });
        _this.head.position.zero().addVector(e2, scale * 24);
        _this.add(_this.head);
        _this.head.release();
        _this.torso = new MinecraftTorso(engine, texture, { height: height, oldSkinLayout: oldSkinLayout });
        _this.torso.position.zero().addVector(e2, scale * 18);
        _this.add(_this.torso);
        _this.torso.release();
        _this.armL = new MinecraftArmL(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.armL.position.zero().addVector(e2, scale * 22).addVector(e1, scale * 6);
        _this.add(_this.armL);
        _this.armL.release();
        _this.armR = new MinecraftArmR(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.armR.position.zero().addVector(e2, scale * 22).subVector(e1, scale * 6);
        _this.add(_this.armR);
        _this.armR.release();
        _this.legL = new MinecraftLegL(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.legL.position.zero().addVector(e2, scale * 10).addVector(e1, scale * 2);
        _this.add(_this.legL);
        _this.legL.release();
        _this.legR = new MinecraftLegR(engine, texture, { height: height, offset: e2.scale(-scale * 4), oldSkinLayout: oldSkinLayout });
        _this.legR.position.zero().addVector(e2, scale * 10).subVector(e1, scale * 2);
        _this.add(_this.legR);
        _this.legR.release();
        return _this;
    }
    return MinecraftFigure;
}(Group));
export { MinecraftFigure };
