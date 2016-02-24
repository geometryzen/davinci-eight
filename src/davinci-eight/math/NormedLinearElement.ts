import LinearElement from './LinearElement'

interface NormedLinearElement<I, M, S, V, MAGNITUDE> extends LinearElement<I, M, S, V, MAGNITUDE> {
    magnitude(): MAGNITUDE
    squaredNorm(): MAGNITUDE
}

export default NormedLinearElement
