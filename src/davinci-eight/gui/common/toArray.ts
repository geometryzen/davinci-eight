const ARR_SLICE = Array.prototype.slice;

export default function  toArray(obj: any) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    }
