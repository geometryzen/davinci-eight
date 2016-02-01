define(["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString_1) {
    function cannotAssignTypeToProperty(type, name) {
        mustBeString_1.default('type', type);
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "Cannot assign type `" + type + "` to property `" + name + "`.";
            }
        };
        return message;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = cannotAssignTypeToProperty;
});
