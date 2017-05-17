"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Geometric3_1 = require("../math/Geometric3");
var Matrix4_1 = require("../math/Matrix4");
var ShareableArray_1 = require("../collections/ShareableArray");
var ShareableBase_1 = require("../core/ShareableBase");
/**
 * A collection of objects that can be treated as a single Renderable.
 */
var Group = (function (_super) {
    tslib_1.__extends(Group, _super);
    /**
     * Constructs
     */
    function Group() {
        var _this = _super.call(this) || this;
        /**
         * Position (vector). This is a short alias for the position property.
         */
        _this.X = Geometric3_1.Geometric3.zero(false);
        /**
         * Attitude (spinor). This is a short alias for the attitude property.
         */
        _this.R = Geometric3_1.Geometric3.one(false);
        /**
         *
         */
        _this.stress = Matrix4_1.Matrix4.one.clone();
        /**
         * Determines whether this group will be rendered.
         */
        _this.visible = true;
        _this.setLoggingName('Group');
        _this.members = new ShareableArray_1.ShareableArray([]);
        return _this;
    }
    /**
     *
     */
    Group.prototype.destructor = function (levelUp) {
        this.members.release();
        this.members = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Group.prototype, "position", {
        /**
         * Position (vector). This is a long alias for the X property.
         */
        get: function () {
            return this.X;
        },
        set: function (value) {
            if (value) {
                this.X.copyVector(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "attitude", {
        /**
         * Attitude (spinor). This is a long alias for the R property.
         */
        get: function () {
            return this.R;
        },
        set: function (value) {
            if (value) {
                this.R.copySpinor(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a Renderable item to this Group.
     */
    Group.prototype.add = function (member) {
        this.members.push(member);
    };
    /**
     * Removes a member item from this Group.
     */
    Group.prototype.remove = function (member) {
        var index = this.members.indexOf(member);
        if (index >= 0) {
            var ms = this.members.splice(index, 1);
            ms.release();
        }
        else {
            return void 0;
        }
    };
    /**
     * Renders all the members of this Group.
     */
    Group.prototype.render = function (ambients) {
        var _this = this;
        if (this.visible) {
            this.members.forEach(function (member) {
                // Make copies of member state so that it can be restored accurately.
                // These calls are recursive so we need to use local temporary variables.
                var x = member.X.x;
                var y = member.X.y;
                var z = member.X.z;
                var a = member.R.a;
                var xy = member.R.xy;
                var yz = member.R.yz;
                var zx = member.R.zx;
                member.X.rotate(_this.R).add(_this.X);
                member.R.mul2(_this.R, member.R);
                member.render(ambients);
                // Resore the member state from the scratch variables.
                member.X.x = x;
                member.X.y = y;
                member.X.z = z;
                member.R.a = a;
                member.R.xy = xy;
                member.R.yz = yz;
                member.R.zx = zx;
            });
        }
    };
    return Group;
}(ShareableBase_1.ShareableBase));
exports.Group = Group;
