export default class Mapa {
    constructor(ctx,x,y,w,h,sqmSizeX,sqmSizeY,maxSqmX,maxSqmY,borderColor,screenSizeX,screenSizeY){
        this.ctx = ctx;
        this.borderColor = borderColor;
        this.borderLT = "#292929";
        this.borderBR = "#6d6d6d";
        this.sqmSizeX = sqmSizeX;
        this.sqmSizeY = sqmSizeY;
        this.maxSqmX = maxSqmX;
        this.maxSqmY = maxSqmY;
        this.screenSize = {
            w: screenSizeX,
            h: screenSizeY
        }
        this.position = {
            x: (this.screenSize.w/2) - ((this.sqmSizeX * this.maxSqmX) / 2),
            y: (this.screenSize.h/2) - ((this.sqmSizeY * this.maxSqmY) / 2)
        };
        this.size = {
            w: this.sqmSizeX * this.maxSqmX,
            h: this.sqmSizeY * this.maxSqmY
        };

    }

    //Função Desenha Borda
    draw(){
        this.ctx.save();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.borderLT;
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x,this.position.y);
        this.ctx.lineTo(this.position.x, (this.size.h + this.position.y) );
        this.ctx.moveTo(this.position.x,this.position.y);
        this.ctx.lineTo((this.size.w + this.position.x), this.position.y );
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.borderBR;
        this.ctx.beginPath();
        this.ctx.moveTo((this.position.x + this.size.w), this.position.y);
        this.ctx.lineTo((this.position.x + this.size.w), this.position.y + this.size.h);
        this.ctx.lineTo(this.position.x, (this.size.h + this.position.y) );
        this.ctx.stroke();
        this.ctx.restore();
        // this.ctx.strokeStyle = this.borderColor; 
        // this.ctx.strokeRect(this.position.x,this.position.y,this.size.w,this.size.h);
    }

    //Função atualiza Posição
    attPosition(){
        this.position = {
        x: (this.screenSize.w/2) - ((this.sqmSizeX * this.maxSqmX) / 2),
        y: (this.screenSize.h/2) - ((this.sqmSizeY * this.maxSqmY) / 2)
        }
    }
}