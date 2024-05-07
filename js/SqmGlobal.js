export default class SqmGlobal {
    constructor(id, coluna, linha){
        this.id = id;
        this.coluna = coluna;
        this.linha = linha;
        this.animado = false;
        this.vel_animacao = 0;
        this.arrasto = 0;
        this.podeAndar = true;
        this.podeJogarItem = true;
        this.itens = [];
        this.objetosFixos = [];
    }
}