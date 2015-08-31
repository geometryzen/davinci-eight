var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DefaultUniformProvider = require('../core/DefaultUniformProvider');
/**
 * @class TreeModel
 * @extends DefaultUniformProvider
 */
var TreeModel = (function (_super) {
    __extends(TreeModel, _super);
    /**
     * @class Model
     * @constructor
     */
    function TreeModel() {
        _super.call(this);
        this.children = [];
    }
    TreeModel.prototype.getParent = function () {
        return this.parent;
    };
    TreeModel.prototype.setParent = function (parent) {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        if (parent) {
            parent.addChild(this);
        }
        this.parent = parent;
    };
    TreeModel.prototype.addChild = function (child) {
        this.children.push(this);
    };
    TreeModel.prototype.removeChild = function (child) {
        var index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
    };
    TreeModel.prototype.getUniformVector3 = function (name) {
        if (this.parent) {
            return this.parent.getUniformVector3(name);
        }
        else {
            return _super.prototype.getUniformVector3.call(this, name);
        }
    };
    /**
     * @method getUniformMatrix3
     * @param name {string}
     */
    TreeModel.prototype.getUniformMatrix3 = function (name) {
        if (this.parent) {
            return this.parent.getUniformMatrix3(name);
        }
        else {
            return _super.prototype.getUniformMatrix3.call(this, name);
        }
    };
    /**
     * @method getUniformMatrix4
     * @param name {string}
     */
    TreeModel.prototype.getUniformMatrix4 = function (name) {
        if (this.parent) {
            return this.parent.getUniformMatrix4(name);
        }
        else {
            return _super.prototype.getUniformMatrix4.call(this, name);
        }
    };
    /**
     * @method getUniformMeta
     */
    TreeModel.prototype.getUniformMeta = function () {
        if (this.parent) {
            return this.parent.getUniformMeta();
        }
        else {
            return _super.prototype.getUniformMeta.call(this);
        }
    };
    /**
     * @method getUniformData
     */
    TreeModel.prototype.getUniformData = function () {
        if (this.parent) {
            return this.parent.getUniformData();
        }
        else {
            return _super.prototype.getUniformData.call(this);
        }
    };
    return TreeModel;
})(DefaultUniformProvider);
module.exports = TreeModel;
