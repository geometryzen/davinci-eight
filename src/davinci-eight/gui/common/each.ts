const ARR_EACH = Array.prototype.forEach;

export default function each(obj: any, itr: any, scope?: any) {

    if (!obj) return;

    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {

        obj.forEach(itr, scope);

    }
    else if (obj.length === obj.length + 0) { // Is number but not NaN

        for (let key = 0, l = obj.length; key < l; key++)
            if (key in obj && itr.call(scope, obj[key], key) === this.BREAK)
                return;

    }
    else {

        for (let key in obj)
            if (itr.call(scope, obj[key], key) === this.BREAK)
                return;

    }

}
