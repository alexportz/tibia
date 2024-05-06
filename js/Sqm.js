export default class Sqm {
    constructor(contexto,x,y,w,h,sprite,sx,sy,sw,sh,px,py,pw,ph){
        this.contexto = contexto;
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
            x:x,
            y:y
        };
        this.size = {
            w:w,
            h:h
        }
    }

    //Renderiza o SQM
    renderiza(){
        this.contexto.drawImage(
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