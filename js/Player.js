export default class Player {
    constructor(ctx,positionX,positionY,sizeW,sizeH,renderImg,renderSx,renderSy,renderSw,renderSh,renderPx,renderPy,renderPw,renderPh,areahitX,areahitY,areahitW,areahitH,marginX,marginY){
        this.position = {
            x: positionX,
            y: positionY
        };
        this.size = {
            w: sizeW,
            h: sizeH
        };
        this.render = {
            img: renderImg,
            sx: renderSy,
            sy: renderSx,
            sw: renderSh,
            sh: renderSw,
            px: renderPx,
            py: renderPy,
            pw: renderPw,
            ph: renderPh
        };
        this.areahit = {
            x: areahitX,
            y: areahitY,
            w: areahitW,
            h: areahitH
        };
        this.marginRender = {
            x: marginX,
            y: marginY
        }
        this.ctx = ctx;
    }

    renderiza(){
        //RENDERIZA O PLAYER
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