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

        this.spriteAnimation = {
            atualDirection: "S", //Define a direção atual do Player
            defaultFrameX: 2, //Define a posição padrão do render x
            defaultFrameY: 0, //Define a posição padrão do render y
            atualFrameX: 2, //Salva a posição atual do RenderX
            atualFrameY: 0, //Salva a posição atual do RenderY
            gapFrame:4, //Define a cada qnts sprites devemos pular para cada render
            speedAnimation: 0.2, //Define a velocidade de animação
            maxFrames: 12 //Define o nro total maximo de players no sprite animação
        };

        this.caminho = {
            sqmInicio: null,
            sqmFim: null,
            sqmOrigem: null,
            sqmDestino: null,
            sqmVerificado: null
        }
    }
    
    //FUNÇÃO DE RENDERIZAR O PLAYER
    renderiza(){
        this.ctx.drawImage(
            this.render.img,
            this.spriteAnimation.atualFrameX * this.render.sw,
            this.spriteAnimation.atualFrameY * this.render.sh,
            this.render.sw,
            this.render.sh,
            this.render.px,
            this.render.py,
            this.render.pw,
            this.render.ph
        );
    }
}