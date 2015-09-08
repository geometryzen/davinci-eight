define(["require", "exports"], function (require, exports) {
    var BufferAttribute = (function () {
        function BufferAttribute(array, itemSize) {
            this.array = array;
            this.itemSize = itemSize;
        }
        Object.defineProperty(BufferAttribute.prototype, "length", {
            get: function () {
                return this.array.length;
            },
            enumerable: true,
            configurable: true
        });
        BufferAttribute.prototype.copyAt = function (index1, attribute, index2) {
            index1 *= this.itemSize;
            index2 *= attribute.itemSize;
            for (var i = 0, l = this.itemSize; i < l; i++) {
                this.array[index1 + i] = attribute.array[index2 + i];
            }
            return this;
        };
        BufferAttribute.prototype.set = function (value, offset) {
            if (offset === undefined)
                offset = 0;
            this.array.set(value, offset);
            return this;
        };
        BufferAttribute.prototype.setX = function (index, x) {
            this.array[index * this.itemSize] = x;
            return this;
        };
        BufferAttribute.prototype.setY = function (index, y) {
            this.array[index * this.itemSize + 1] = y;
            return this;
        };
        BufferAttribute.prototype.setZ = function (index, z) {
            this.array[index * this.itemSize + 2] = z;
            return this;
        };
        BufferAttribute.prototype.setXY = function (index, x, y) {
            index *= this.itemSize;
            this.array[index] = x;
            this.array[index + 1] = y;
            return this;
        };
        BufferAttribute.prototype.setXYZ = function (index, x, y, z) {
            index *= this.itemSize;
            this.array[index] = x;
            this.array[index + 1] = y;
            this.array[index + 2] = z;
            return this;
        };
        BufferAttribute.prototype.setXYZW = function (index, x, y, z, w) {
            index *= this.itemSize;
            this.array[index] = x;
            this.array[index + 1] = y;
            this.array[index + 2] = z;
            this.array[index + 3] = w;
            return this;
        };
        BufferAttribute.prototype.clone = function () {
            return new BufferAttribute(new Float32Array(this.array), this.itemSize);
        };
        return BufferAttribute;
    })();
    return BufferAttribute;
});
