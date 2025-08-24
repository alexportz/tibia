export default class Bloco {
    constructor(sqm,sqmPai,distanciaInicio,distanciaFim,pesoDoMovimento,indicador){
        this.sqm = sqm;
        this.sqmPai = sqmPai;
        this.distanciaInicio = distanciaInicio;
        this.distanciaFim = distanciaFim;
        this.pesoDoMovimento = pesoDoMovimento;
        this.indicador = indicador;
        this.tipoDeBloco = "percurso";
    }
}