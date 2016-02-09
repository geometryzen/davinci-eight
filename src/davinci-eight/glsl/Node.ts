import Token from './Token'

interface Node {
    mode: number;
    token: Token;
    children: Node[];
    type: string;
    id: string;
    expecting?: string;
}

export default Node
