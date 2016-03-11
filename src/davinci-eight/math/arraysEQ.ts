import isDefined from '../checks/isDefined'
import isNull from '../checks/isNull'
import isUndefined from '../checks/isUndefined'

export default function(a: any[], b: any[]): boolean {
  if (isDefined(a)) {
    if (isDefined(b)) {
      if (!isNull(a)) {
        if (!isNull(b)) {
          const aLen = a.length
          const bLen = b.length
          if (aLen === bLen) {
            for (let i = 0; i < aLen; i++) {
              if (a[i] !== b[i]) {
                return false
              }
            }
            return true
          }
          else {
            return false
          }
        }
        else {
          return false
        }
      }
      else {
        return isNull(b)
      }
    }
    else {
      return false
    }
  }
  else {
    return isUndefined(b)
  }
}
