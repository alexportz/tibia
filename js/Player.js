export default class Player {
    constructor(ctx,sprite,sx,sy,sw,sh,px,py,pw,ph){
        this.ctx = ctx;
        this.render = {
            img: sprite,
            sx: sx,
            sy: sy,
            sw: sw,
            sh: sh,
            px: px,
            py: py,
            pw: pw,
            ph: ph
        };
    }
    
    //FUNÇÃO DE RENDERIZAR O PLAYER
    renderiza(){
        this.ctx.drawImage(
            this.render.img,
            this.render.sx,
            this.render.sy,
            this.render.sw,
            this.render.sh,
            this.render.px,
            this.render.py,
            this.render.pw,
            this.render.ph
        );
    }
}