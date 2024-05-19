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

//CRIA O MAPAVIEW (Instancia Mapa)
let mapaView = new Mapa(
    ctx,
    sqmRenderSizeX,
    sqmRenderSizeY,
    maxSqmX,
    maxSqmY,
    borderColor,
    todosSqms,
    innerWidth,
    innerHeight
);    

//DEFINE A SPRITE USADA
const spriteMapa = new Image();
        spriteMapa.src = "sprites/mapa.png";

//INICIA O GAME
function startGame(){
    //Cria o MapaView de Sqms
    createMapView();

    //INICIA A FUNÇÃO DE LOOP
    loopGame();
}

//LOOPGAME
function loopGame(){

    //Exibe os Sqms do MapaView
    mapaView.renderizaSqms();
    mapaView.renderizaBorda();

    //Chama a propria função novamente
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
            
            let mapaViewPosX = mapaView.position.x;
            let mapaViewPosY = mapaView.position.y;
            let colunaAtual = i;
            let linhaAtual = j;
            let renderSizeX = mapaView.sqmRenderSizeX;
            let renderSizeY = mapaView.sqmRenderSizeY;
            
            //CALCULO DO SQM
            let posXSqm = mapaViewPosX + (colunaAtual * renderSizeX);
            let posYSqm = mapaViewPosY + (linhaAtual * renderSizeY);
            let posRenderSqmX = 72;
            let posRenderSqmY = 72;


            //Cria variavel do SQM
            let meuSqm = new Sqm(
                ctx,
                spriteMapa,
                posRenderSqmX,
                posRenderSqmY,
                sqmSizeX,
                sqmSizeY,
                posXSqm,
                posYSqm,
                sqmRenderSizeX,
                sqmRenderSizeY,
                mapaViewPosX,
                mapaViewPosY,
                colunaAtual,
                linhaAtual,
                renderSizeX,
                renderSizeY
            );

            //ADICIONA O SQM NO ARRAY DO MAPAVIEW
            mapaView.sqms.push(meuSqm);
        }
    }
    //**FIM DO LOOP QUE CRIA SQMS */
}

//FUNÇÃO RESIZE DA TELA
addEventListener("resize", function(){

    //ATUALIZA TAMANHO TELA
    mapaView.screenSize.width = innerWidth;
    mapaView.screenSize.height = innerHeight;
    mapaView.getPosition();
    
    //ATUALIZA POSICAO DO MAPAVIEW NOS SQMS
    mapaView.sqms.forEach( sqm => {
        sqm.renderAtual.posX = mapaView.position.x;
        sqm.renderAtual.posY = mapaView.position.y;
    })

    //DEFINE TAMANHO DO CANVAS
    cnv.width = innerWidth;
    cnv.height = innerHeight;
    
})