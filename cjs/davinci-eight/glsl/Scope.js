var Scope = (function () {
    function Scope(state) {
        this.state = state;
        this.scopes = [];
        this.current = null;
    }
    Scope.prototype.enter = function (s) {
        this.scopes.push(this.current = this.state[0].scope = s || {});
    };
    Scope.prototype.exit = function () {
        this.scopes.pop();
        this.current = this.scopes[this.scopes.length - 1];
    };
    Scope.prototype.define = function (str) {
        this.current[str] = this.state[0];
    };
    Scope.prototype.find = function (name, fail) {
        for (var i = this.scopes.length - 1; i > -1; --i) {
            if (this.scopes[i].hasOwnProperty(name)) {
                return this.scopes[i][name];
            }
        }
        return null;
    };
    return Scope;
})();
module.exports = Scope;
