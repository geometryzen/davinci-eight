import {Shareable} from '../core/Shareable'

export default function <T extends Shareable>(mine: T, yours: T): T {
    if (mine !== yours) {
        if (yours) {
            yours.addRef()
        }
        if (mine) {
            mine.release()
        }
        return yours
    }
    else {
        // Keep mine, it's the same as yours anyway.
        return mine
    }
}
