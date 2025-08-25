//IMPORTA ARQUIVOS EXTERNOS
import Sqm from "./Sqm.js";
import Mapa from "./Mapa.js";
import Player from "./Player.js";
import Bloco from "./Bloco.js";

//CANVAS
const cnv = document.querySelector("#tela");
const ctx = cnv.getContext("2d");

//DEFINE TAMANHO DO CANVAS
cnv.width = innerWidth;
cnv.height = innerHeight;

//Definições Iniciais
let sqmSizeX = 72; //Tamanho do Sqm da Sprite OriginalX
let sqmSizeY = 72; //Tamanho do Sqm da Sprite OriginalY
let sqmRenderSizeX = 72; //Tamanho do Render SqmX na tela
let sqmRenderSizeY = 72; //Tamanho do Render SqmX na tela

//Define tela Visual do Game
let maxSqmX = 15;
let maxSqmY = 11;

//Definições de posição no Map
let colunaNow = 1;
let linhaNow = 1;
let colunaInicial = 1;
let linhaInicial = 1;

let sqmNow; //Salvar o SQM ATUAL.
let jogador;
let moveN;
let moveS;
let moveL;
let moveO;
//Diagonais
let moveNO;
let moveNE;
let moveSO;
let moveSE;

//Dados do player
let proporcao = 2;
let playerSizeX = 64; //proporcao*sqmSizeX;
let playerSizeY = 64; //proporcao*sqmSizeY;
let playerRenderSizeX = proporcao*sqmRenderSizeX;
let playerRenderSizeY = proporcao*sqmRenderSizeY;

//DEFINIÇÕES DO MAPA VIEW
let todosSqms = []; //Totais de SQMs da tela em Array

//DEFINE A SPRITE DO MAPA
const spriteMapa = new Image();
        spriteMapa.src = "sprites/mapa/sprite-mapa.jpg";

//DEFINE A SPRITE DO PLAYER
const spritePlayer = new Image();
      spritePlayer.src = "sprites/player/sprite-player-knight.png";

//DEFINE MAPAGERAL
let mapaGeral;
let mapaView; //define o mapaView vazio


//INICIA O GAME
function startGame(){
    //INICIA E CARREGA O MAPA GERAL
    carregarMapaGeral();

    //Instancia o Player
    instanciaPlayer();

    //Chama as animações
    animaSprites();

    //INICIA A FUNÇÃO DE LOOP
    loopGame();
}

//LOOPGAME
function loopGame(){
    //Limpar a tela do Canvas
    ctx.clearRect(0,0,innerWidth,innerHeight);

    //Exibe os Sqms do MapaView
    mapaView.renderizaSqms();
    mapaView.renderizaBorda();

    //Redesenha o Player na Cena
    jogador.renderiza();

    //MOVIMENTAÇÃO
    movimentar();

    //Desenha os SQMS da lista de SQMs listaDeSqmsGerais
    marcaSqmsGerais();

    //Desenha os SQMS da lista de SQMs listaDeSqmsPossiveis
    marcaSqmsPossiveis();

    //ExibeMeio da Tela
    // exibeMeioTela();

    //Chama a propria função novamente
    requestAnimationFrame(loopGame);
}

//Variaveis para animação
let acumulador = 0;  
let lastTime = performance.now();

//FUNÇÃO DE ANIMAÇÃO DE SPRITES
function animaSprites(){
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) /1000;

    lastTime = currentTime; //Atualiza o tempo anterior

    //Adiciona o valor do deltaTime no acumulador
    acumulador += deltaTime;

    if(acumulador >= jogador.spriteAnimation.speedAnimation){
        //Verificar se está movendo
        if(movendo){
            //Faz o codigo continuar a animação de movimento
            jogador.spriteAnimation.atualFrameX += jogador.spriteAnimation.gapFrame;

            //Verifica se passou do limite da Sprite
            if(jogador.spriteAnimation.atualFrameX >= jogador.spriteAnimation.maxFrames){
                jogador.spriteAnimation.atualFrameX = jogador.spriteAnimation.defaultFrameX + jogador.spriteAnimation.gapFrame;
            }

        } else {
            //Definir o sprite parado como padrão
            jogador.spriteAnimation.atualFrameX = jogador.spriteAnimation.defaultFrameX;
        }

        //Zera o acumulador
        acumulador = 0;
    }

    //Chama o loop de AnimationFrame
    requestAnimationFrame(animaSprites);
}


//CARREGA O GAME
spriteMapa.onload = function(){
    console.log("Carregou o Game");
    //CRIA O MAPAVIEW (Instancia Mapa)
    mapaView = new Mapa(
        ctx,
        spriteMapa,
        sqmSizeX,
        sqmSizeY,
        sqmRenderSizeX,
        sqmRenderSizeY,
        maxSqmX,
        maxSqmY,
        todosSqms,
        innerWidth,
        innerHeight
    );  
    startGame();
}

//***FUNÇÕES***//
//Função que cria o MapaView dos SQMS
function createMapView(){
    mapaView.sqms=[];

    let lgCount = linhaInicial;
    let cgCount = colunaInicial;

    //LOOP PARA CRIAR OS SQMS
    for (let l=0; l < maxSqmY; l++ ){
        for(let c=0; c < maxSqmX; c++) {

            //NOVA FORMA DE CRIAR O SQM
            let meuSqm = instanciaSqm(lgCount,cgCount,c,l,"main");
            
            //ADICIONA O SQM NO ARRAY DO MAPAVIEW
            mapaView.sqms.push(meuSqm);

            //DEFINE O SQM ATUAL 
            let midSqmX = Math.floor(maxSqmX/2);
            let midSqmY = Math.floor(maxSqmY/2);

            //Identifica o SQM do Player (meio da Tela)
            if(c==midSqmX && l==midSqmY){
                sqmNow = meuSqm;
            }


            cgCount++;
            if(cgCount >= (maxSqmX + colunaInicial)) { cgCount = colunaInicial; }

        }
        lgCount++
    }
    //**FIM DO LOOP QUE CRIA SQMS */
    
    

    //INSTANCIA A PRIMEIRA VEZ AS BORDAS
    createSqmBorders();

    //TESTA O PRIMEIRO RENDER
    mapaView.renderizaSqms();
    //Redesenha o Player na Cena
    jogador.renderiza();
    //Verifica os Obstaculos nos SQMS laterais
    verificaObstaculos();
}

//FUNÇÃO QUE CRIA SQM DE BORDAS ADICIONAIS
function createSqmBorders(){
    //LOOP PARA RENDERIZAR BORDAS
    let totalSqmsRenderizados = mapaView.sqms.length; 

    for( let i=0; i<totalSqmsRenderizados; i++){
        let maxSqmDoRenderX = maxSqmX -1;  
        let maxSqmDoRenderY = maxSqmY -1;
        let colunaMatrizDoSqm = mapaView.sqms[i].geralInfos.coluna;
        let linhaMatrizDoSqm = mapaView.sqms[i].geralInfos.linha;
        let colunaRenderSqm = mapaView.sqms[i].renderAtual.coluna;
        let linhaRenderSqm = mapaView.sqms[i].renderAtual.linha; 

        //VERIFICA SE OS SQMS SÃO DAS BORDAS
        //Verifica se SQM é NO
        if(colunaRenderSqm == 0 && linhaRenderSqm == 0){ 
            let newSqm = instanciaSqm(colunaMatrizDoSqm-1,linhaMatrizDoSqm-1,colunaRenderSqm,linhaRenderSqm,"no");
            mapaView.sqmsBorda.push(newSqm); 
        }
        //Verifica se SQM é N
        if(linhaRenderSqm == 0){
            let newSqm = instanciaSqm(colunaMatrizDoSqm-1,linhaMatrizDoSqm,colunaRenderSqm,linhaRenderSqm,"n");
            mapaView.sqmsBorda.push(newSqm);
        }
        //Verifica se SQM é NE
        if(colunaRenderSqm == maxSqmDoRenderX && linhaRenderSqm == 0){
            let newSqm = instanciaSqm(colunaMatrizDoSqm-1,linhaMatrizDoSqm+1,colunaRenderSqm,linhaRenderSqm,"ne");
            mapaView.sqmsBorda.push(newSqm);
        }
        //Verifica se SQM é O
        if(colunaRenderSqm == 0){
            let newSqm = instanciaSqm(colunaMatrizDoSqm,linhaMatrizDoSqm-1,colunaRenderSqm,linhaRenderSqm,"o");
            mapaView.sqmsBorda.push(newSqm);
        }
        //Verifica se SQM é L
        if(colunaRenderSqm == maxSqmDoRenderX){
            let newSqm = instanciaSqm(colunaMatrizDoSqm,linhaMatrizDoSqm+1,colunaRenderSqm,linhaRenderSqm,"l");
            mapaView.sqmsBorda.push(newSqm);
        }
        //Verifica se ele o SQM SO
        if(colunaRenderSqm == 0 && linhaRenderSqm == maxSqmDoRenderY){
            let newSqm = instanciaSqm(colunaMatrizDoSqm+1,linhaMatrizDoSqm-1,colunaRenderSqm,linhaRenderSqm,"so");
            mapaView.sqmsBorda.push(newSqm);
        }
        //Verifica se SQM é S
        if(linhaRenderSqm == maxSqmDoRenderY){
            let newSqm = instanciaSqm(colunaMatrizDoSqm+1,linhaMatrizDoSqm,colunaRenderSqm,linhaRenderSqm,"s");
            mapaView.sqmsBorda.push(newSqm);
        }
        //Verifica se SQM é SE
        if(colunaRenderSqm == maxSqmDoRenderX && linhaRenderSqm == maxSqmDoRenderY){
            let newSqm = instanciaSqm(colunaMatrizDoSqm+1,linhaMatrizDoSqm+1,colunaRenderSqm,linhaRenderSqm,"se");
            mapaView.sqmsBorda.push(newSqm);
        }
    } 

}

//FUNÇÃO RESIZE DA TELA
addEventListener("resize", function(){

    //ATUALIZA TAMANHO TELA
    mapaView.screenSize.width = innerWidth;
    mapaView.screenSize.height = innerHeight;
    mapaView.getPosition();

    //DEFINE TAMANHO DO CANVAS
    cnv.width = innerWidth;
    cnv.height = innerHeight;

    //Recria o MapView
    createMapView();
        
    //REPOSICIONAR O PLAYER NA TELA
    let posPlayerX = innerWidth/2 - playerRenderSizeX + (playerRenderSizeX/(proporcao*2));
    let posPlayerY = innerHeight/2 - playerRenderSizeY+ (playerRenderSizeY/(proporcao*2));
    jogador.render.px = posPlayerX;
    jogador.render.py = posPlayerY;
})

//FUNÇÃO INSTANCIAR O PLAYER
function instanciaPlayer(){
    //Variaveis
    let posPlayerX = innerWidth/2 - playerRenderSizeX + (playerRenderSizeX/(proporcao*2));
    let posPlayerY = innerHeight/2 - playerRenderSizeY+ (playerRenderSizeY/(proporcao*2));
    let posRenderPlayerX = 0;
    let posRenderPlayerY = 0;

    //CRIA O PLAYER (Instancia do Player)
    jogador = new Player(
        ctx,
        spritePlayer,
        posRenderPlayerX,
        posRenderPlayerY,
        playerSizeX,
        playerSizeY,
        posPlayerX,
        posPlayerY,
        playerRenderSizeX,
        playerRenderSizeY
    );
    // //Chamando o RenderizaPlayer
    jogador.renderiza();
}

//FUNÇÃO EXIBE MEIO TELA
function exibeMeioTela(){
    //DESENHA MEIO DO MAPA
    ctx.save();
        ctx.strokeStyle = "#F00";
        ctx.beginPath();
        ctx.moveTo(0,innerHeight/2);
        ctx.lineTo(innerWidth, innerHeight/2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(innerWidth/2,0);
        ctx.lineTo(innerWidth/2, innerHeight);
        ctx.stroke();
    ctx.restore();
}

//FUNÇÃO RETORNA O SQM DO MAPA GERAL
function getSqm(coluna, linha){
    const index = mapaGeral.sqms.findIndex(
        sqm => sqm.sqmCol === coluna && sqm.sqmLin === linha
    );

    //VERIFICA SE NÃO HÁ SQM CARREGADO
    if(mapaGeral.sqms[index] == undefined){
        return mapaGeral.sqmDefault[0];
    }

    return mapaGeral.sqms[index];
}

//FUNCAO DE INSTANCIA SQM
function instanciaSqm(geralCol,geralLin,mvCol,mvLin,direcional){
     
    //RECUPERA AS INFORMACOES DO SQM DO MAPA GERAL
    let sqmGeneral = getSqm(geralCol,geralLin);
 
    //Define corretor de posições para Bordas
    let fixPosX = 0;
    let fixPosY = 0;    

    //VERIFICA DIRECIONAL
    if(direcional == "no"){ fixPosX= -sqmRenderSizeX; fixPosY =-sqmRenderSizeY;}
    if(direcional == "n"){  fixPosX=0; fixPosY = -sqmRenderSizeY;}
    if(direcional == "ne"){ fixPosX=sqmRenderSizeX; fixPosY=-sqmRenderSizeY; }
    if(direcional == "o"){ fixPosX=-sqmRenderSizeX; fixPosY=0; }
    if(direcional == "l"){ fixPosX= sqmRenderSizeX; fixPosY=0; }
    if(direcional == "so"){ fixPosX= -sqmRenderSizeX; fixPosY= +sqmRenderSizeY; }
    if(direcional == "s"){ fixPosX=0; fixPosY=sqmRenderSizeY; }
    if(direcional == "se"){ fixPosX= sqmRenderSizeX; fixPosY= sqmRenderSizeY; }

    //Cria variavel do SQM
     let sqm = new Sqm(
        mapaView.ctx,
        sqmGeneral.id,
        mapaView.spriteMapa,
        sqmSizeX * sqmGeneral.renderCol,
        sqmSizeY * sqmGeneral.renderLin,
        sqmSizeX,
        sqmSizeY,
        0,
        0,
        sqmRenderSizeX,
        sqmRenderSizeY,
        mapaView.position.x + fixPosX,
        mapaView.position.y + fixPosY,
        geralCol,
        geralLin,
        mvCol,
        mvLin,
        fixPosX,
        fixPosY,
        sqmRenderSizeX,
        sqmRenderSizeY,
        sqmSizeX,
        sqmSizeY,
        mapaView,
        sqmGeneral.propriedades.podemover,
        sqmGeneral.propriedades.arrasto,
        sqmGeneral.propriedades.podejogaritem
    );
    return sqm;
}

//FUNÇÃO DE CARREGAR O MAPA GERAL
async function carregarMapaGeral(){
    try {
        const response = await fetch('json/mapa.json');
        if(!response.ok){
           throw new Error("Erro ao carregar o Mapa"); 
        }

        //Salva o Mapa na variavel mapaGeral
        mapaGeral = await response.json();
        
        //CRIAR o MAPAVIEW DE SQM
        createMapView();

    } catch(error){
        console.error('Error:', error);
    }
}

//FUNÇÃO DE MOVIMENTAÇÃO
let contador = 0;
let velocidade = 1;
let movendo = false;

function movimentar(){
    if(movendo){
        if(jogador.caminho.sqmFim != null){ 
            contador++;
            let sqmOrigem = jogador.caminho.sqmOrigem;
            // let sqmDestino = jogador.caminho.sqmDestino;
            let sqmDestino = jogador.caminho.caminhoFinal[jogador.caminho.caminhoFinal.length -2];

            let posicaoColunaAtual = sqmOrigem.sqmCol;
            let posicaoLinhaAtual = sqmOrigem.sqmLin;
            let posicaoColunaDestino = sqmDestino.sqmCol;
            let posicaoLinhaDestino = sqmDestino.sqmLin;

            let diferencialColuna = posicaoColunaDestino - posicaoColunaAtual;
            let diferencialLinha = posicaoLinhaDestino - posicaoLinhaAtual;

            let speedX = velocidade * diferencialColuna;
            let speedY = velocidade * diferencialLinha; 
            console.log("SPEED", speedX, speedY);

            //MOVE
            // console.log("START",posicaoColunaAtual, posicaoColunaDestino);
            if(posicaoColunaAtual != posicaoColunaDestino){ 

                if(posicaoColunaAtual < posicaoColunaDestino){
                    mapaView.sqms.forEach( sqm => { sqm.sprite.py +=speedY; });
                    mapaView.sqmsBorda.forEach( sqmBorda => {  sqmBorda.sprite.py +=speedY; });
                } else
                if(posicaoColunaAtual > posicaoColunaDestino){
                    mapaView.sqms.forEach( sqm => { sqm.sprite.py -=speedY; });
                    mapaView.sqmsBorda.forEach( sqmBorda => {  sqmBorda.sprite.py -=speedY; });
                } else
                if(posicaoLinhaAtual < posicaoLinhaDestino){
                    mapaView.sqms.forEach( sqm => { sqm.sprite.px -=speedX;});
                    mapaView.sqmsBorda.forEach( sqmBorda => {sqmBorda.sprite.px -=speedX;});
                } else
                if(posicaoLinhaAtual > posicaoLinhaDestino){
                    mapaView.sqms.forEach( sqm => { sqm.sprite.px +=speedX;});
                    mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.px +=speedX;});
                }

                if(contador >= 72){
                    contador = 0;
                    // movendo = false;
                    jogador.caminho.caminhoFinal.shift();
                    console.log(jogador.caminho.caminhoFinal);
                    //Desativa o movimento se não houver mais caminhos
                    if(jogador.caminho.caminhoFinal.length <= 1){
                        movendo = false;
                    }
                }
                // if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
                //     contador = 0; 
                //     movendo = false;
                //     console.log(jogador.caminho.caminhoFinal);

                //     // //Remove o último elemento do caminho
                //     // removeUltimoElementoCaminho(); 
                //     // console.log("END",posicaoColunaAtual, posicaoColunaDestino);

                //     // //Salva as informações do SQM INICIO E DESTINO no Jogador
                //     // console.log("HAR",retornaSqmLocalViaSqmGlobal(sqmDestino), retornaSqmLocalViaSqmGlobal(jogador.caminho.sqmFim));
                //     // defineCaminhoDoJogador( retornaSqmLocalViaSqmGlobal(sqmDestino), retornaSqmLocalViaSqmGlobal(jogador.caminho.sqmFim));
                //     // console.log(jogador.caminho.caminhoFinal);

                //     // //INICIA A BUSCA DO MELHOR CAMINHO
                //     // retornaMelhorCaminho(sqmDestino);
                //     // console.log(jogador.caminho.caminhoFinal);

                //     // createMapView();
                // }
            }

        }
    }
}

function removeUltimoElementoCaminho(){
    if(jogador.caminho.caminhoFinal.length > 0){
        jogador.caminho.caminhoFinal.pop();
    }
}

// function movimentar(){ 
//     console.log(movendo);
//     if(movendo){
//         contador++;

//         //VERIFICA MOVIMENTACAO VIA MOUSE
//         if(jogador.caminho.caminhoFinal.length >= 1){
//             let atualSqm = jogador.caminho.caminhoFinal[jogador.caminho.caminhoFinal.length -1];
//             let proxSqm = jogador.caminho.caminhoFinal[jogador.caminho.caminhoFinal.length -2];

//             console.log(atualSqm, proxSqm);

//             if(proxSqm == undefined){
//                 proxSqm = atualSqm;
//             }

//             let colAtual = atualSqm.sqmCol;
//             let linAtual = atualSqm.sqmLin;
//             let colProx = proxSqm.sqmCol;
//             let linProx = proxSqm.sqmLin;
//             let diffColuna = colAtual - colProx;
//             let diffLinha = linAtual - linProx;

//             linhaInicial = diffLinha;
//             colunaInicial = diffColuna;

//             console.log(diffColuna, diffLinha);

//             //VERIFICA SE DEU O TEMPO DO CONTADOR PARA PARAR O MOVIMENTO
//             if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
//                 contador = 0;

//                 // Remove o último elemento do caminho
//                 jogador.caminho.caminhoFinal.splice( jogador.caminho.caminhoFinal.length -1, 1);
//                 colunaInicial = colunaNow;
//                 linhaInicial = linhaNow;
//                 linhaNow = linhaInicial;
//                 colunaNow = colunaInicial;


//                 // console.log("INFOS");
//                 // console.log(jogador.caminho.caminhoFinal.length);
//                 // console.log(jogador.caminho.caminhoFinal);

//                 // //Refaz o caminho para verificar alterações
//                 // defineCaminhoDoJogador(jogador.caminho.caminhoFinal[jogador.caminho.caminhoFinal.length -2], jogador.caminho.caminhoFinal[0]);

//                 // //INICIA A BUSCA DO MELHOR CAMINHO
//                 // console.log("SQM IDS DO SQM INICIAL");
//                 // retornaMelhorCaminho(jogador.caminho.caminhoFinal[jogador.caminho.caminhoFinal.length -1]);
//             }
//         } else {
//             movendo = false;
//         }
//         //FIM VERIFICAÇÃO VIA MOUSE 



//         //MOVE DIAG. NE
//         if(linhaNow < linhaInicial && colunaNow > colunaInicial){ 
//             mapaView.sqms.forEach( sqm => { sqm.sprite.py +=velocidade; sqm.sprite.px -=velocidade;});
//             mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py +=velocidade; sqmBorda.sprite.px -=velocidade;});
//             if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
//                 contador = 0;
//                 colunaInicial = colunaNow;
//                 linhaInicial = linhaNow;
//                 movendo = false;
//                 createMapView();
//             }
//         } else
//         //MOVE DIAG. NO
//         if(linhaNow < linhaInicial && colunaNow < colunaInicial){ 
//             mapaView.sqms.forEach( sqm => { sqm.sprite.py +=velocidade; sqm.sprite.px +=velocidade;});
//             mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py +=velocidade; sqmBorda.sprite.px +=velocidade;});
//             if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
//                 contador = 0;
//                 colunaInicial = colunaNow;
//                 linhaInicial = linhaNow;
//                 movendo = false;
//                 createMapView();
//             }
//         } else
//         //MOVE DIAG. SE
//         if(linhaNow > linhaInicial && colunaNow > colunaInicial){  
//             mapaView.sqms.forEach( sqm => { sqm.sprite.py -=velocidade; sqm.sprite.px -=velocidade;});
//             mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py -=velocidade; sqmBorda.sprite.px -=velocidade;});
//             if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
//                 contador = 0;
//                 colunaInicial = colunaNow;
//                 linhaInicial = linhaNow;
//                 movendo = false;
//                 createMapView();
//             }
//         } else
//         //MOVE DIAG. SO
//         if(linhaNow > linhaInicial && colunaNow < colunaInicial){  
//             mapaView.sqms.forEach( sqm => { sqm.sprite.py -=velocidade; sqm.sprite.px +=velocidade;});
//             mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py -=velocidade; sqmBorda.sprite.px +=velocidade;});
//             if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
//                 contador = 0;
//                 colunaInicial = colunaNow;
//                 linhaInicial = linhaNow;
//                 movendo = false;
//                 createMapView();
//             }
//         } else
//         //MOVE LESTE
//         if(colunaNow > colunaInicial){ 
//             mapaView.sqms.forEach( sqm => { sqm.sprite.px -=velocidade; });
//             mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.px -=velocidade; });
//             //CASO ATINGIU O PROX. SQM
//             if(contador >= sqmRenderSizeX){
//                 contador = 0;
//                 colunaInicial = colunaNow;
//                 movendo = false;
//                 createMapView();
//             }
//         } else
//         //MOVE OESTE
//         if(colunaNow < colunaInicial){ 
//             mapaView.sqms.forEach( sqm => { sqm.sprite.px +=velocidade; });
//             mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.px +=velocidade; });  
//             //CASO ATINGIU O PROX. SQM
//             if(contador >= sqmRenderSizeX){
//                 contador = 0;
//                 colunaInicial = colunaNow;
//                 movendo = false;
//                 createMapView();
//             }
//         } else
//         //MOVE SUL
//         if(linhaNow > linhaInicial){
//             mapaView.sqms.forEach( sqm => { sqm.sprite.py -=velocidade; });
//             mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py -=velocidade; }); 
//             //CASO ATINGIU O PROX. SQM
//             if(contador >= sqmRenderSizeY){
//                 contador = 0;
//                 linhaInicial = linhaNow;
//                 movendo = false;
//                 createMapView();
//             }
//         } else
//         //MOVE NORT
//         if(linhaNow < linhaInicial){
//             mapaView.sqms.forEach( sqm => { sqm.sprite.py +=velocidade; });
//             mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py +=velocidade; }); 
//             //CASO ATINGIU O PROX. SQM
//             if(contador >= sqmRenderSizeY){
//                 contador = 0;
//                 linhaInicial = linhaNow;
//                 movendo = false;
//                 createMapView();
//             }
//         } 
//     }
// }

//DETECTA OBSTACULO
function verificaObstaculos(){
    let index = Math.floor(maxSqmX * maxSqmY / 2);

    //DEFINE OS VALORES DAS VARIAVEIS DE MOVIMENTO
    moveN = mapaView.sqms[index - maxSqmX].propriedades.podemover;
    moveS = mapaView.sqms[index + maxSqmX].propriedades.podemover;
    moveL = mapaView.sqms[index + 1].propriedades.podemover;
    moveO = mapaView.sqms[index - 1].propriedades.podemover;

    //Diagonais
    moveNO = mapaView.sqms[index - maxSqmX -1].propriedades.podemover;
    moveNE = mapaView.sqms[index - maxSqmX +1].propriedades.podemover;
    moveSO = mapaView.sqms[index + maxSqmX -1].propriedades.podemover;
    moveSE = mapaView.sqms[index + maxSqmX +1].propriedades.podemover;

}


//Detecta Clique
addEventListener("keydown", function(e){

    //Limpar caminhos
    limpaCaminhos();

    let tecla = e.code;

    let globalCol = sqmNow.geralInfos.coluna;
    let globalLin = sqmNow.geralInfos.linha;
    let maxGlobalX = 43;
    let maxGlobalY = 31;

    //SE MOVEU PARA CIMA
    if(tecla=='KeyW' && globalCol > 1 && moveN){
        //VERIFICA SE A DIREÇÃO ATUAL É DIFERENTE DA NOVA DIREÇÃO
        if(jogador.spriteAnimation.atualDirection !== "N" && !movendo){
            //Define a nova Direção
            jogador.spriteAnimation.atualDirection = "N";
            //Define os valores para X e Y do render
            jogador.spriteAnimation.defaultFrameX = 0;
            jogador.spriteAnimation.atualFrameX = 0;
        }
        
        if(movendo==false){
            linhaNow-=1;
            movendo = true;
        }
    }
    //SE MOVEU PARA BAIXO
    if(tecla=='KeyS' && globalCol < maxGlobalY && moveS){
        //VERIFICA SE A DIREÇÃO ATUAL É DIFERENTE DA NOVA DIREÇÃO
        if(jogador.spriteAnimation.atualDirection !== "S" && !movendo){
            //Define a nova Direção
            jogador.spriteAnimation.atualDirection = "S";
            //Define os valores para X e Y do render
            jogador.spriteAnimation.defaultFrameX = 2;
            jogador.spriteAnimation.atualFrameX = 2;
        }

        if(movendo==false){
            linhaNow+=1;
            movendo = true;
        }
    }
    //SE MOVEU PARA ESQ.
    if(tecla=='KeyA' && globalLin > 1 && moveO){
        //VERIFICA SE A DIREÇÃO ATUAL É DIFERENTE DA NOVA DIREÇÃO
        if(jogador.spriteAnimation.atualDirection !== "O" && !movendo){
            //Define a nova Direção
            jogador.spriteAnimation.atualDirection = "O";
            //Define os valores para X e Y do render
            jogador.spriteAnimation.defaultFrameX = 3;
            jogador.spriteAnimation.atualFrameX = 3;
        }

        if(movendo==false){
            colunaNow-=1;
            movendo = true;
        } 
    }
    //SE MOVEU PARA DIR.
    if(tecla=='KeyD' && globalLin < maxGlobalX && moveL){
        //VERIFICA SE A DIREÇÃO ATUAL É DIFERENTE DA NOVA DIREÇÃO
        if(jogador.spriteAnimation.atualDirection !== "L" && !movendo){
            //Define a nova Direção
            jogador.spriteAnimation.atualDirection = "L";
            //Define os valores para X e Y do render
            jogador.spriteAnimation.defaultFrameX = 1;
            jogador.spriteAnimation.atualFrameX = 1;
        }

        if(movendo==false){
            colunaNow+=1;
            movendo = true;
        }
    }  

    //DIAGONAIS
    //CASO MOVEU PARA NO
    if(tecla=='KeyQ' && globalCol > 1  && globalLin > 1  && moveNO){
        //VERIFICA SE A DIREÇÃO ATUAL É DIFERENTE DA NOVA DIREÇÃO
        if(jogador.spriteAnimation.atualDirection !== "NO" && !movendo){
            //Define a nova Direção
            jogador.spriteAnimation.atualDirection = "NO";
            //Define os valores para X e Y do render
            jogador.spriteAnimation.defaultFrameX = 3;
            jogador.spriteAnimation.atualFrameX = 3;
        }

        if(movendo==false){
            linhaNow-=1;
            colunaNow-=1;
            movendo = true;
        }
    }
    //CASO MOVEU PARA NE
    if(tecla=='KeyE' && globalCol > 1  && globalLin < maxGlobalX  && moveNE){
        //VERIFICA SE A DIREÇÃO ATUAL É DIFERENTE DA NOVA DIREÇÃO
        if(jogador.spriteAnimation.atualDirection !== "NE" && !movendo){
            //Define a nova Direção
            jogador.spriteAnimation.atualDirection = "NE";
            //Define os valores para X e Y do render
            jogador.spriteAnimation.defaultFrameX = 1;
            jogador.spriteAnimation.atualFrameX = 1;
        }

        if(movendo==false){
            linhaNow-=1;
            colunaNow+=1;
            movendo = true;
        }
    }
    //CASO MOVEU PARA SO
    if(tecla=='KeyZ' && globalCol < maxGlobalY  && globalLin > 1  && moveSO){
        //VERIFICA SE A DIREÇÃO ATUAL É DIFERENTE DA NOVA DIREÇÃO
        if(jogador.spriteAnimation.atualDirection !== "SO" && !movendo){
            //Define a nova Direção
            jogador.spriteAnimation.atualDirection = "SO";
            //Define os valores para X e Y do render
            jogador.spriteAnimation.defaultFrameX = 3;
            jogador.spriteAnimation.atualFrameX = 3;
        }

        if(movendo==false){
            linhaNow+=1;
            colunaNow-=1;
            movendo = true;
        }
    }
    //CASO MOVEU PARA SE
    if(tecla=='KeyX' && globalCol < maxGlobalY  && globalLin < maxGlobalX  && moveSE){
        //VERIFICA SE A DIREÇÃO ATUAL É DIFERENTE DA NOVA DIREÇÃO
        if(jogador.spriteAnimation.atualDirection !== "SE" && !movendo){
            //Define a nova Direção
            jogador.spriteAnimation.atualDirection = "SE";
            //Define os valores para X e Y do render
            jogador.spriteAnimation.defaultFrameX = 1;
            jogador.spriteAnimation.atualFrameX = 1;
        }

        if(movendo==false){
            linhaNow+=1;
            colunaNow+=1;
            movendo = true;
        }
    }

})


////***MOVIMENTAÇÃO VIA CLICK  */////
////***MOVIMENTAÇÃO VIA CLICK  */////
////***MOVIMENTAÇÃO VIA CLICK  */////

//Algoritmos auxiliares
function retornaIndexLocalDoPlayer(){ 
    let sqmPlayer = Math.floor(maxSqmX * maxSqmY / 2);
    return sqmPlayer;
}
function retornaSqmLocalViaSqmGlobal(sqmGlobal){
    return mapaView.sqms.find(sqm => sqm.id === sqmGlobal.id);
}
function retornaSqmGlobalViaSqmLocal(sqmLocal){
    return mapaView.sqms[sqmLocal];
}
function retornaIndexLocalSqmClicado(mousePosX, mousePosY){
    //Define Limite do MapaLocal
    let localMapPositionX = mapaView.position.x;
    let localMapPositionY = mapaView.position.y;
    let maxLocalMapaSizeX = localMapPositionX + (mapaView.sqmSizeX * mapaView.maxSqmX);
    let maxLocalMapaSizeY = localMapPositionY + (mapaView.sqmSizeY * mapaView.maxSqmY);

     //Verifica se o clique está dentro da área MapaView (área jogavel)
    if(mousePosX >= localMapPositionX && mousePosX <= maxLocalMapaSizeX && mousePosY >= localMapPositionY && mousePosY <= maxLocalMapaSizeY) {
        //RETORNA O SQM CLICADO
        let colunaLocalClicada = (Math.floor((mousePosX - localMapPositionX) / mapaView.sqmSizeX));
        let linhaLocalClicada = (Math.floor((mousePosY - localMapPositionY) / mapaView.sqmSizeY)) * 15;
        let sqmClicado = colunaLocalClicada + linhaLocalClicada;

        return sqmClicado;
    } 
    
    return 82; 
}

function defineCaminhoDoJogador(sqmInicio, sqmFim){
    jogador.caminho.sqmInicio = mapaGeral.sqms[retornaIndexSqmGlobal(sqmInicio)];
    jogador.caminho.sqmFim = mapaGeral.sqms[retornaIndexSqmGlobal(sqmFim)];
    jogador.caminho.sqmOrigem = mapaGeral.sqms[retornaIndexSqmGlobal(sqmInicio)];
    jogador.caminho.sqmDestino = mapaGeral.sqms[retornaIndexSqmGlobal(sqmFim)];
}
function retornaIndexSqmGlobal(sqmGlobal){
    let indexSqmGlobal = mapaGeral.sqms.findIndex(obj => obj.id === sqmGlobal.id);
    return indexSqmGlobal;
}
function retornaDistanciaInicial(sqmAtual, sqmInicio){
    let diffColuna = sqmAtual.sqmCol - sqmInicio.sqmCol;
    let diffLinha = sqmAtual.sqmLin - sqmInicio.sqmLin; 
    return Math.abs(diffColuna) + Math.abs(diffLinha);
}
function retornaDistanciaFinal(sqmAtual, sqmFim){
    let diffColuna = sqmAtual.sqmCol - sqmFim.sqmCol;
    let diffLinha = sqmAtual.sqmLin - sqmFim.sqmLin; 
    return Math.abs(diffColuna) + Math.abs(diffLinha);
}
function verificaListaGeral(sqm){
    return jogador.caminho.listaDeSqmsGerais.some(sqmGerais => sqmGerais.sqm.id === sqm.id);
}
function verificaListaSqmsPossiveis(sqm){
    return jogador.caminho.listaDeSqmsPossiveis.some(sqmVerificado => sqmVerificado.sqm.id === sqm.id);
}
function marcaSqmsGerais(){
    jogador.caminho.listaDeSqmsGerais.forEach(bloco => { 
        let sqmAtualGlobal = bloco.sqm;
        // console.log("GLOBAL", sqmAtualGlobal);
        // console.log(sqmAtualGlobal.sqmCol, sqmAtualGlobal.sqmLin);
        let sqmAtualLocal = mapaView.sqms.find(sqm => sqm.geralInfos.coluna === sqmAtualGlobal.sqmCol && sqm.geralInfos.linha === sqmAtualGlobal.sqmLin);
        if(sqmAtualLocal){
            // console.log("LOCAL", sqmAtualLocal)
            ctx.fillStyle = "rgba(241, 6, 6, 0.59)";
            ctx.fillRect(sqmAtualLocal.sprite.px, sqmAtualLocal.sprite.py, sqmAtualLocal.sprite.pw, sqmAtualLocal.sprite.ph);
        }
    });
}
function marcaSqmsPossiveis(){
    jogador.caminho.listaDeSqmsPossiveis.forEach(bloco => { 
        let sqmAtualGlobal = bloco.sqm;
        // console.log("GLOBAL", sqmAtualGlobal);
        // console.log(sqmAtualGlobal.sqmCol, sqmAtualGlobal.sqmLin);
        let sqmAtualLocal = mapaView.sqms.find(sqm => sqm.geralInfos.coluna === sqmAtualGlobal.sqmCol && sqm.geralInfos.linha === sqmAtualGlobal.sqmLin);
        
        if(sqmAtualLocal){
            // console.log("LOCAL", sqmAtualLocal)
            ctx.fillStyle = "rgba(117, 247, 31, 0.62)";
            ctx.fillRect(sqmAtualLocal.sprite.px, sqmAtualLocal.sprite.py, sqmAtualLocal.sprite.pw, sqmAtualLocal.sprite.ph);
            ctx.font = "10px Arial";
            ctx.fillStyle = "blue";
            ctx.fillText(sqmAtualLocal.id, sqmAtualLocal.sprite.px + 20, sqmAtualLocal.sprite.py + 20);
            ctx.fillStyle = "black";
            ctx.fillText(bloco.sqmPai.id, sqmAtualLocal.sprite.px + 20, sqmAtualLocal.sprite.py + 40);
        }
    });
}
function defineCaminhoFinal(){
    let caminhoCompleto = false;
    // console.log("Caminho final");
    // console.log(jogador.caminho.listaDeSqmsPossiveis);

    let blocoVerificado = jogador.caminho.listaDeSqmsPossiveis.find(bloco => bloco.tipoDeBloco === "destino");
    // console.log("Bloco Destino", blocoVerificado);

    while(!caminhoCompleto){

        //Faz loop na lista SqmsPossiveis pegando o Bloco destino e retornando o caminho
        jogador.caminho.caminhoFinal.push(blocoVerificado.sqm);

        //Caso o bloco verificado seja igual a origem, finaliza o caminho
        if(blocoVerificado.sqm.id === jogador.caminho.sqmOrigem.id){
            caminhoCompleto = true;
            console.log("Caminho completo");
            console.log(jogador.caminho.caminhoFinal);
        }

        //Retorna o bloco do sqmPai do blocoVerificado
        blocoVerificado = jogador.caminho.listaDeSqmsPossiveis.find(bloco => bloco.sqm.id === blocoVerificado.sqmPai.id);

        //Atualiza o bloco verificado
        // console.log("NOVO SQM PAI:", blocoVerificado);
    }
    
    //Ativa o movendo para caminhos
    movendo = true;
}
function limpaCaminhos(){
    jogador.caminho.listaDeSqmsGerais = [];
    jogador.caminho.listaDeSqmsPossiveis = [];
    jogador.caminho.caminhoFinal = [];
    jogador.caminho.sqmInicio = null;
    jogador.caminho.sqmFim = null;
    jogador.caminho.sqmOrigem = null;
    jogador.caminho.sqmDestino = null;
    jogador.caminho.sqmProvavel = null;
}
//Fim dos Algoritmos auxiliares

function verificaVizinhos(indexDoSqmGlobal){
    let encontrouDestino = false;
    let totalSqmsHorizontaisNoMapaGlobal = mapaGeral.info.renderSizeX;

    //Retorna os sqms vizinhos
    let sqmNO = mapaGeral.sqms[indexDoSqmGlobal - (totalSqmsHorizontaisNoMapaGlobal + 1)];
    let sqmN = mapaGeral.sqms[indexDoSqmGlobal - totalSqmsHorizontaisNoMapaGlobal];
    let sqmNE = mapaGeral.sqms[indexDoSqmGlobal - (totalSqmsHorizontaisNoMapaGlobal - 1)];
    let sqmO = mapaGeral.sqms[indexDoSqmGlobal - 1];
    let sqmActual = mapaGeral.sqms[indexDoSqmGlobal];
    let sqmL = mapaGeral.sqms[indexDoSqmGlobal + 1];
    let sqmSO = mapaGeral.sqms[indexDoSqmGlobal + (totalSqmsHorizontaisNoMapaGlobal - 1)];
    let sqmS = mapaGeral.sqms[indexDoSqmGlobal + totalSqmsHorizontaisNoMapaGlobal];
    let sqmSE = mapaGeral.sqms[indexDoSqmGlobal + (totalSqmsHorizontaisNoMapaGlobal + 1)];

    //Lista de vizinhos
    let listaVizinhos = [sqmNO, sqmN, sqmNE, sqmO, sqmActual, sqmL, sqmSO, sqmS, sqmSE];
    let listaVizinhosDiagonais = [sqmNO, sqmNE, sqmSO, sqmSE];

    //RETORNA OS IDS DOS SQMS NAS BORDAS
    // console.log(sqmNO.id, sqmN.id, sqmNE.id);
    // console.log(sqmO.id, sqmActual.id, sqmL.id);
    // console.log(sqmSO.id, sqmS.id, sqmSE.id);
 
    // console.log("SQMATUAL", sqmActual);
    // Cria os blocos para cada sqm vizinho
    listaVizinhos.forEach(sqm => {
        if(!encontrouDestino){
            // console.log("Analise do sqm: ", sqm.id);

            //Verifica se o sqm possui obstaculos e pula ele
            if(sqm.propriedades.podemover == false) { 
                // console.log("Pulou o sqm ", sqm.id, " tem obstáculo") 
            } else {
                // console.log("Sqm ", sqm.id, " não tem obstáculo");
            };
            if(sqm.propriedades.podemover == false) return;

            //Verifica se o sqm já foi adicionado na lista de SqmsGerais
            let estaNaListaGeral = verificaListaGeral(sqm);
            // console.log('Sqm ', sqm.id, ' não está na Lista Geral')
            if(estaNaListaGeral) return;

            //Verifica se o sqm já foi adicionado na lista de SqmsVerificados
            let estaNaListaSqmsVerificados = verificaListaSqmsPossiveis(sqm);
            // console.log('Sqm ', sqm.id, ' não está na Lista de Sqms Possíveis')
            if(estaNaListaSqmsVerificados) return;

            //Define os calculos e pesos
            let distanciaInicial = retornaDistanciaInicial(sqm, jogador.caminho.sqmInicio);
            let distanciaFinal = retornaDistanciaFinal(sqm, jogador.caminho.sqmFim);
            let pesoDoMovimento = (listaVizinhosDiagonais.includes(sqm)) ? 10 : 10;
            let sqmPai = sqmActual;
            let indicador = distanciaInicial + distanciaFinal + pesoDoMovimento;

            //Cria o bloco
            let bloco = new Bloco(
                sqm,
                sqmPai,
                distanciaInicial,
                distanciaFinal,
                pesoDoMovimento,
                indicador
            ); 

            // Adiciona o bloco à lista de SQMs gerais
            // console.log("Sqm ", sqm.id, " adicionado à lista de SQMs gerais");
            jogador.caminho.listaDeSqmsGerais.push(bloco);

            //Ordena a lista de blocos pelo indicador (menor para maior)
            jogador.caminho.listaDeSqmsGerais.sort((a, b) => a.indicador - b.indicador);

        }
    });

    //PASSOU POR TODA LISTA AO REDOR DO SQM PROVAVEL E ENCONTROU O MAIS PROVAVEL
    //SQM PARA REMOVER DA LISTA (O MAIS PROVAVEL)
    // console.log("SQM PARA REMOVER: ", jogador.caminho.listaDeSqmsGerais[0].sqm);
    
    //REGISTRA O SQM PAI DO SQM PROVAVEL
    if(jogador.caminho.listaDeSqmsGerais[0].sqmPai == null){
        jogador.caminho.listaDeSqmsGerais[0].sqmPai = sqmActual;
        // console.log("SQM ATUAL E PAI AGORA", sqmActual);
    }
    
    // console.log("SQM REVIEW: ", jogador.caminho.listaDeSqmsGerais[0]);

    // ADICIONA O SQM MAIS PROVAVEL NA LISTA DOS POSSIVEIS Antes de remove-lo
    jogador.caminho.listaDeSqmsPossiveis.push(jogador.caminho.listaDeSqmsGerais[0]);
    
    //Define o primeiro bloco como o verificado
    jogador.caminho.sqmVerificado = jogador.caminho.listaDeSqmsGerais[0].sqm;
    // console.log("SQM VERIFICADO: ", jogador.caminho.sqmVerificado);

    //Altera o Label do tipo de BLOCO
     if(jogador.caminho.sqmVerificado.id == jogador.caminho.sqmFim.id){
        jogador.caminho.listaDeSqmsGerais[0].tipoDeBloco = "destino";
     }

    //Remove o bloco da lista de SQMs gerais
    jogador.caminho.listaDeSqmsGerais.shift();
    
    //RETORNA A LISTA FINAL GERAL APÓS REMOVIDO O SQM PROVAVEL
    // console.log(jogador.caminho.listaDeSqmsGerais);

    //Verifica se o sqmAtual é o destino
    // console.log(jogador.caminho.sqmVerificado.id, jogador.caminho.sqmFim.id);
    if(jogador.caminho.sqmVerificado.id == jogador.caminho.sqmFim.id){
        encontrouDestino = true;
        console.log("# # # Chegou ao destino # # #");
        //Define o tipo de bloco como destino
        defineCaminhoFinal(); 
    } else {
        // console.log("Sqm ", jogador.caminho.sqmVerificado.id, " não é o destino");
        //Chama novamente a função com Index do SQM mais provável
        verificaVizinhos(retornaIndexSqmGlobal(jogador.caminho.sqmVerificado));
    }
}
//Algoritmo de retornar melhor caminho
function retornaMelhorCaminho(sqmInicial){
    let indexSqmGlobal = retornaIndexSqmGlobal(sqmInicial); 
    let sqmVerificado = verificaVizinhos(indexSqmGlobal)
}

addEventListener("mousedown", function(e){
    
    limpaCaminhos();

    let indexSqmLocalDoPlayer = retornaIndexLocalDoPlayer();
    let indexSqmLocalClicado = retornaIndexLocalSqmClicado(e.clientX, e.clientY);

    let sqmGlobalDoPlayer = retornaSqmGlobalViaSqmLocal(indexSqmLocalDoPlayer);
    let sqmGlobalClicado = retornaSqmGlobalViaSqmLocal(indexSqmLocalClicado);

    //Verifica se sqm clicado não é obstáculo
    if (sqmGlobalClicado.propriedades.podemover == false) {
        return;
    }

    //Salva as informações do SQM INICIO E DESTINO no Jogador
    console.log("HER",sqmGlobalDoPlayer, sqmGlobalClicado);
    defineCaminhoDoJogador(sqmGlobalDoPlayer, sqmGlobalClicado);

    //INICIA A BUSCA DO MELHOR CAMINHO
    console.log("SQM IDS DO SQM INICIAL")
    let caminhoFinal = retornaMelhorCaminho(sqmGlobalDoPlayer);

    // console.log("SQM IDS DO SQM FINAL")
    // let caminhoFinal2 = verificaVizinhos(retornaIndexSqmGlobal(sqmGlobalClicado)); 


    // console.log(indexSqmLocalDoPlayer);
    // console.log(sqmGlobalDoPlayer);
    // console.log(indexSqmLocalClicado);
    // console.log(sqmGlobalClicado);
})