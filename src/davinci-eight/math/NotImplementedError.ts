export default class NotImplementedError extends Error {
    public name = 'NotImplementedError'
    constructor(message: string) {
        super(message);
    }
}
