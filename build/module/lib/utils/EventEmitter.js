var EventEmitter = (function () {
    function EventEmitter(owner) {
        this.owner = owner;
    }
    EventEmitter.prototype.addEventListener = function (eventName, callback) {
        this._eventRegistry = this._eventRegistry || {};
        var listeners = this._eventRegistry[eventName];
        if (!listeners) {
            listeners = this._eventRegistry[eventName] = [];
        }
        if (listeners.indexOf(callback) === -1) {
            listeners.push(callback);
        }
        return callback;
    };
    EventEmitter.prototype.removeEventListener = function (eventName, callback) {
        this._eventRegistry = this._eventRegistry || {};
        var listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;
        var index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };
    EventEmitter.prototype.emit = function (eventName, key, value) {
        if (this._eventRegistry) {
            var listeners = this._eventRegistry[eventName];
            if (listeners) {
                var iLength = listeners.length;
                if (iLength) {
                    for (var i = 0; i < iLength; i++) {
                        listeners[i](eventName, key, value, this.owner);
                    }
                }
            }
        }
    };
    return EventEmitter;
}());
export { EventEmitter };
