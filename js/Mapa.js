export default class Mapa {
    constructor(ctx,sprite,sqmSizeX,sqmSizeY,sqmRenderSizeX,sqmRenderSizeY, maxSqmX, maxSqmY,sqms,screenSizeW,screenSizeH){
        this.ctx = ctx;
        this.spriteMapa = sprite;
        this.sqmSizeX = sqmSizeX;
        this.sqmSizeY = sqmSizeY;
        this.sqmRenderSizeX = sqmRenderSizeX;
        this.sqmRenderSizeY = sqmRenderSizeY;
        this.maxSqmX = maxSqmX;
        this.maxSqmY = maxSqmY;
        this.sqms = sqms;
        this.sqmsBorda = [];
        this.screenSize = {
            width: screenSizeW,
            height: screenSizeH
        };
        this.position = {
            x: Math.floor((innerWidth/2) - ((sqmRenderSizeX * maxSqmX ) / 2)),
            y: Math.floor((innerHeight/2) - ((sqmRenderSizeY * maxSqmY) / 2))
        };
        this.size = {
            w: sqmRenderSizeX * maxSqmX,
            h: sqmRenderSizeY * maxSqmY
        } 
    }
    //Função Renderiza Borda
    renderizaBorda(){
        //TOPO ESQUEDA
        let TEX = this.position.x;
        let TEY = this.position.y;
        //BAIXO ESQUERDA
        let BEX = this.position.x;
        let BEY = this.position.y + this.size.h;
        //TOPO DIREITA
        let TDX = this.position.x + this.size.w;
        let TDY = this.position.y;
        //BAIXO DIREITA
        let BDX = this.position.x + this.size.w;
        let BDY = this.position.y + this.size.h;

        //FAZ OS DESENHOS
        this.ctx.save();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "#333";
            this.ctx.beginPath();
            this.ctx.moveTo(BEX,BEY);
            this.ctx.lineTo(TEX,TEY);
            this.ctx.lineTo(TDX,TDY);
            this.ctx.stroke();

            this.ctx.strokeStyle = "#666";
            this.ctx.beginPath();
            this.ctx.moveTo(TDX,TDY);
            this.ctx.lineTo(BDX,BDY);
            this.ctx.lineTo(BEX,BEY);
            this.ctx.stroke();
        this.ctx.restore();
    }

    //Função Renderiza os SQM
    renderizaSqms(){
        //Renderiza cada SQM separado no Loop
        this.sqms.forEach( sqm => {
            sqm.renderiza();
        });
        //Renderiza cada SQM da Borda
        this.sqmsBorda.forEach( sqmBorda => {
            sqmBorda.renderiza();
        });

        //ESCONDE BORDAS
        this.ctx.clearRect(0,0,this.position.x, this.screenSize.height);
        this.ctx.clearRect(this.position.x + this.maxSqmX * this.sqmRenderSizeX,0,this.position.x, this.screenSize.height);
        this.ctx.clearRect(0,0,this.screenSize.width, this.position.y);
        this.ctx.clearRect(0,this.position.y + this.maxSqmY * this.sqmRenderSizeY,this.screenSize.width, this.position.y);
    }

    //Função define posicao XY do MapaView
    getPosition(){
        let newPosX = Math.floor(this.screenSize.width/2 - ((this.sqmRenderSizeX * this.maxSqmX) / 2));
        let newPosY = Math.floor(this.screenSize.height/2 - ((this.sqmRenderSizeY * this.maxSqmY) / 2));
        this.position.x = newPosX;
        this.position.y = newPosY;
        
        //ATT posicao do SQMS
        this.sqms.forEach( sqm => {
            sqm.getPosition();
        });
        //ATT posicao dos SQMS BORDA
        this.sqmsBorda.forEach( sqmBorda => {
            sqmBorda.getPosition();
        }); 
    }
}