export default class Mapa {
    constructor(ctx, x, y, w, h, sqmRenderSizeX,sqmRenderSizeY, maxSqmX, maxSqmY,borderColor,sqms){
        this.ctx = ctx;
        this.borderColor = borderColor;
        this.sqmRenderSizeX = sqmRenderSizeX;
        this.sqmRenderSizeY = sqmRenderSizeY;
        this.maxSqmX = maxSqmX;
        this.maxSqmY = maxSqmY;
        this.sqms = sqms;
        this.position = {
            x: x,
            y: y
        };
        this.size = {
            w: w,
            h: h
        }
    }
    //Função Renderiza Borda
    renderizaBorda(){
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.strokeRect(this.position.x, this.position.y, this.size.w, this.size.h);
    }

    //Função Renderiza os SQM
    renderizaSqms(){
        // console.log("Renderizou o SQM");
        this.sqms.forEach( (sqmAtual) => {
            sqmAtual.renderiza();
        })
    }
}