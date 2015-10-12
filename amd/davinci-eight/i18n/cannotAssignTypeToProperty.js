define(["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString) {
    /**
     *
     */
    function cannotAssignTypeToProperty(type, name) {
        mustBeString('type', type);
        mustBeString('name', name);
        var message = {
            get message() {
                return "Cannot assign type `" + type + "` to property `" + name + "`.";
            }
        };
        return message;
    }
    return cannotAssignTypeToProperty;
});
