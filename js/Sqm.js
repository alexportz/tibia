export default class Mapa {
    constructor(ctx,sprite,sx,sy,sw,sh,px,py,pw,ph,mapaViewPosX,mapaViewPosY,colunaAtual,linhaAtual,renderSizeX,renderSizeY){
        this.ctx = ctx;
        this.renderAtual = {
            posX: mapaViewPosX,
            posY: mapaViewPosY,
            coluna: colunaAtual,
            linha: linhaAtual,
            renderX: renderSizeX,
            renderY: renderSizeY
        };  
        this.sprite = {
            img: sprite,
            x: sx,
            y: sy,
            w: sw,
            h: sh,
            px: px,
            py: py,
            pw: pw,
            ph: ph
        };
    }

    //Renderiza o SQM
    renderiza(){
        this.ctx.drawImage(
        this.sprite.img,
        this.sprite.x,
        this.sprite.y,
        this.sprite.w,
        this.sprite.h,
        this.renderAtual.posX + (this.renderAtual.coluna * this.renderAtual.renderX),
        this.renderAtual.posY + (this.renderAtual.linha * this.renderAtual.renderY),
        this.sprite.pw,
        this.sprite.ph
        );
    } 
}