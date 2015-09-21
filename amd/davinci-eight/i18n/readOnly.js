define(["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString) {
    /**
     *
     */
    function readOnly(name) {
        mustBeString('name', name);
        var message = {
            get message() {
                return "Property `" + name + "` is readonly.";
            }
        };
        return message;
    }
    return readOnly;
});
