export default class Mapa {
    constructor(ctx,x,y,w,h,sqmSizeX,sqmSizeY,maxSqmX,maxSqmY,borderColor){
        this.ctx = ctx;
        this.borderColor = borderColor;
        this.sqmSizeX = sqmSizeX;
        this.sqmSizeY = sqmSizeY;
        this.maxSqmX = maxSqmX;
        this.maxSqmY = maxSqmY;
        this.position = {
            x: (innerWidth/2) - ((this.sqmSizeX * this.maxSqmX) / 2),
            y: y
        };
        this.size = {
            w: this.sqmSizeX * this.maxSqmX,
            h: this.sqmSizeY * this.maxSqmY
        }
    }

    //Função Desenha Borda
    draw(){
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.strokeRect(this.position.x,this.position.y,this.size.w,this.size.h);
    }
}