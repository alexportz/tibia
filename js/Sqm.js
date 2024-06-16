export default class Mapa {
    constructor(ctx,id,sprite,sx,sy,sw,sh,px,py,pw,ph,mapaViewPosX,mapaViewPosY,colunaGeral,linhaGeral,renderLocalCol,renderLocalLin,fixPosX,fixPosY,renderSizeX,renderSizeY,sqmSizeX,sqmSizeY,mapaview,podemover,arrasto,podejogaritem){
        this.ctx = ctx;
        this.id= id;
        this.geralInfos = {
            sqmSizeX: sqmSizeX,
            sqmSizeY: sqmSizeY,
            coluna: colunaGeral,
            linha: linhaGeral
        };
        this.renderAtual = {
            posX: mapaViewPosX,
            posY: mapaViewPosY,
            coluna: renderLocalCol,
            linha: renderLocalLin,
            renderX: renderSizeX,
            renderY: renderSizeY,
            fixPosX: fixPosX,
            fixPosY: fixPosY
        };  
        this.sprite = {
            img: sprite,
            x: sx,
            y: sy,
            w: sw,
            h: sh,
            px: this.renderAtual.posX + this.renderAtual.coluna * this.renderAtual.renderX,
            py: this.renderAtual.posY + this.renderAtual.linha * this.renderAtual.renderY,
            pw: pw,
            ph: ph
        };
        this.propriedades = {
            podemover : podemover,
            arrasto: arrasto,
            podejogaritem: podejogaritem
        }
        this.mapaView = mapaview;
    }

    //Renderiza o SQM
    renderiza(){
        this.ctx.drawImage(
        this.sprite.img,
        this.sprite.x,
        this.sprite.y,
        this.sprite.w,
        this.sprite.h,
        this.sprite.px,
        this.sprite.py,
        this.sprite.pw,
        this.sprite.ph
        );
    } 

    //PegaPosicao
    getPosition(){
        let newPosX = (innerWidth/2 - (this.mapaView.sqmRenderSizeX * this.mapaView.maxSqmX)/2 ) + this.renderAtual.coluna * this.mapaView.sqmRenderSizeX + this.renderAtual.fixPosX;
        let newPosY = (innerHeight/2 -(this.mapaView.sqmRenderSizeY * this.mapaView.maxSqmY)/2) + this.renderAtual.linha * this.mapaView.sqmRenderSizeY + this.renderAtual.fixPosY;
        this.sprite.px = newPosX;
        this.sprite.py = newPosY;
    }
}