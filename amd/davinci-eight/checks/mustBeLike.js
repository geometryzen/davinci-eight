define(["require", "exports", '../checks/mustHaveOwnProperty'], function (require, exports, mustHaveOwnProperty) {
    function mustBeLike(name, value, duck, contextBuilder) {
        var props = Object.keys(duck);
        console.log("props => " + JSON.stringify(props));
        for (var i = 0, iLength = props.length; i < iLength; i++) {
            mustHaveOwnProperty(name, value, props[i], contextBuilder);
        }
        return value;
    }
    return mustBeLike;
});
