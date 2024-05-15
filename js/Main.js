//IMPORTA ARQUIVOS EXTERNOS
import Sqm from "./Sqm.js";
import Mapa from "./Mapa.js";

//CANVAS
const cnv = document.querySelector("#tela");
const ctx = cnv.getContext("2d");

//DEFINE TAMANHO DO CANVAS
cnv.width = innerWidth;
cnv.height = innerHeight;

//Definições Iniciais
let sqmSizeX = 72; //Tamanho do Sqm da Sprite OriginalX
let sqmSizeY = 72; //Tamanho do Sqm da Sprite OriginalY
let sqmRenderSizeX = 25; //Tamanho do Render SqmX na tela
let sqmRenderSizeY = 25; //Tamanho do Render SqmX na tela

//Define tela Visual do Game
let maxSqmX = 15;
let maxSqmY = 11;

//DEFINIÇÕES DO MAPA VIEW
let todosSqms = []; //Totais de SQMs da tela em Array
let borderColor = "#FFF";
let posMapaViewX = (innerWidth/2) - ((sqmRenderSizeX * maxSqmX) / 2); //calculo de meio de telaX
let posMapaViewY = (innerHeight/2) - ((sqmRenderSizeY * maxSqmY) / 2); //calculo de meio de telaY;

let mapaView = new Mapa(
    ctx,
    posMapaViewX,
    posMapaViewY,
    sqmRenderSizeX * maxSqmX,
    sqmRenderSizeY * maxSqmY,
    sqmRenderSizeX,
    sqmRenderSizeY,
    maxSqmX,
    maxSqmY,
    borderColor,
    todosSqms
);
    

//DEFINE A SPRITE USADA
const spriteMapa = new Image();
        spriteMapa.src = "sprites/mapa.png";

//INICIA O GAME
function startGame(){
    //Cria o MapaView de Sqms
    createMapView();

    //Inicia a função de Loop
    loopGame();
}

//LOOP DO GAME
function loopGame(){
    //LIMPAR A TELA DO CANVA
    limpaTelaCanvas();

    //Renderiza todos Sqms do MapaView
    mapaView.renderizaSqms();

    //Renderizar a Borda
    mapaView.renderizaBorda();

    //Inicia o loop da propria função
    requestAnimationFrame(loopGame);
}

//CARREGA O GAME
spriteMapa.onload = function(){
    console.log("Carregou o Game");
    startGame();
}


//***FUNÇÕES***//
//Função que cria o MapaView dos SQMS
function createMapView(){
    //LOOP PARA CRIAR OS SQMS
    for (let i=0; i < maxSqmX; i++ ){
        for(let j=0; j < maxSqmY; j++) {
            let posXSqm = mapaView.position.x + (i * mapaView.sqmRenderSizeX);
            let posYSqm = mapaView.position.y + (j * mapaView.sqmRenderSizeY);
            let posRenderSqmX = 72;
            let posRenderSqmY = 72;
            let renderSizeX = mapaView.sqmRenderSizeX;
            let renderSizeY = mapaView.sqmRenderSizeY;
            let colunaAtual = i;
            let linhaAtual = j;
            let positionMapX = mapaView.position.x;
            let positionMapY = mapaView.position.y;

            //Cria variavel do SQM
            let meuSqm = new Sqm(
                ctx,
                posXSqm,
                posYSqm,
                sqmSizeX,
                sqmSizeY,
                spriteMapa,
                posRenderSqmX,
                posRenderSqmY,
                sqmSizeX,
                sqmSizeY,
                posXSqm,
                posYSqm,
                sqmRenderSizeX,
                sqmRenderSizeY,
                renderSizeX,
                renderSizeY,
                colunaAtual,
                linhaAtual,
                positionMapX,
                positionMapY
            );
            
            //FAZ O PRIMEIRO RENDER DO SQM ao Criar
            meuSqm.renderiza();
            //Adiciona os SQM no Array dos SQMS do MapaView
            mapaView.sqms.push(meuSqm);
        }
    }
    //**FIM DO LOOP QUE CRIA SQMS */
}

//Função Limpa Tela Canvas
function limpaTelaCanvas(){
    ctx.clearRect(0,0,cnv.width,cnv.height);
}

//FUNÇÃO ALTERANDO RESOLUÇÃO
addEventListener("resize", function(){ 
    //ATUALIZA TAMANHO DO CANVAS
    cnv.width = innerWidth;
    cnv.height = innerHeight;

    //Atualiza as Posições da Posicao
    posMapaViewX = (innerWidth/2) - ((sqmRenderSizeX * maxSqmX) / 2); //calculo de meio de telaX
    posMapaViewY = (innerHeight/2) - ((sqmRenderSizeY * maxSqmY) / 2); //calculo de meio de telaY

    //Atribui as novas posições para o MapaView
    mapaView.position.x = posMapaViewX;
    mapaView.position.y = posMapaViewY;

    //ATUALIZA POSIÇÃO DO MAPA DOS SQMS RENDERIZADOS
    mapaView.sqms.forEach( meuSqm => {
        meuSqm.renderAtual.positionMapX = posMapaViewX;
        meuSqm.renderAtual.positionMapY = posMapaViewY;
    })

})