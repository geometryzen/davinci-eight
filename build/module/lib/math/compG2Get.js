export function compG2Get(m, index) {
    switch (index) {
        case 0: {
            return m.a;
        }
        case 1: {
            return m.x;
        }
        case 2: {
            return m.y;
        }
        case 3: {
            return m.b;
        }
        default: {
            throw new Error("index => " + index);
        }
    }
}
