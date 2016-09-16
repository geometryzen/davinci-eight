export default function subscribeMixin(target: any) {
    var listeners = new Set<any>();

    return Object.assign(target, {

        on(type, f) {
            let listener = {};
            listener[type] = f;
            listeners.add(listener);
        },

        off(type, f) {
            if (f) {
                let listener = {};
                listener[type] = f;
                listeners.delete(listener);
            }
            else {
                for (let item of listeners) {
                    for (let key of Object.keys(item)) {
                        if (key === type) {
                            listeners.delete(item);
                            return;
                        }
                    }
                }
            }
        },

        offAll() {
            listeners.clear();
        },

        trigger(event, ...data) {
            for (var listener of listeners) {
                if (typeof listener[event] === 'function') {
                    listener[event](...data);
                }
            }
        },

        listSubscriptions() {
            for (let item of listeners) {
                console.log(item);
            }
        }
    });
}
