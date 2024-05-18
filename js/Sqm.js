export default class Mapa {
    constructor(ctx,x,y,w,h,sprite,sx,sy,sw,sh,px,py,pw,ph){
        this.ctx = ctx;
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
        this.position = {
            x: 0,
            y: 0
        };
        this.size = {
            w:w,
            h:h
        }
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
}