import Usage from './Usage';

interface DataBuffer<T extends ArrayBufferView> {
    data: T;
    usage: Usage;
    bufferData(data?: T, usage?: Usage): void;
    bind(): void;
    unbind(): void;
}

export default DataBuffer;
