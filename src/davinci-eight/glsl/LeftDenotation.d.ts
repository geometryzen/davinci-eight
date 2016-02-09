import Symbol from './Symbol'

interface LeftDenotation {
    (left: Symbol): Symbol
}

export default LeftDenotation
