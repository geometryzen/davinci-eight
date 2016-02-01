import IUnknown from '../core/IUnknown';

interface IUnknownExt<T extends IUnknown> extends IUnknown {
    incRef(): T;
    decRef(): T;
}

export default IUnknownExt;
