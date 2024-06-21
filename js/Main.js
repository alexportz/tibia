//IMPORTA ARQUIVOS EXTERNOS
import Sqm from "./Sqm.js";
import Mapa from "./Mapa.js";
import Player from "./Player.js";

//CANVAS
const cnv = document.querySelector("#tela");
const ctx = cnv.getContext("2d");

//DEFINE TAMANHO DO CANVAS
cnv.width = innerWidth;
cnv.height = innerHeight;

//Definições Iniciais
let sqmSizeX = 72; //Tamanho do Sqm da Sprite OriginalX
let sqmSizeY = 72; //Tamanho do Sqm da Sprite OriginalY
let sqmRenderSizeX = 45; //Tamanho do Render SqmX na tela
let sqmRenderSizeY = 45; //Tamanho do Render SqmX na tela

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
let playerSizeX = proporcao*sqmSizeX;
let playerSizeY = proporcao*sqmSizeY;
let playerRenderSizeX = proporcao*sqmRenderSizeX;
let playerRenderSizeY = proporcao*sqmRenderSizeY;

//DEFINIÇÕES DO MAPA VIEW
let todosSqms = []; //Totais de SQMs da tela em Array

//DEFINE A SPRITE DO MAPA
const spriteMapa = new Image();
        spriteMapa.src = "sprites/sprite-mapa.jpg";

//DEFINE A SPRITE DO PLAYER
const spritePlayer = new Image();
      spritePlayer.src = "sprites/player-cyc-ok.png";

//DEFINE MAPAGERAL
let mapaGeral;
let mapaView; //define o mapaView vazio


//INICIA O GAME
function startGame(){
    //INICIA E CARREGA O MAPA GERAL
    carregarMapaGeral();

    //Instancia o Player
    instanciaPlayer();

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

    //ExibeMeio da Tela
    //exibeMeioTela();

    //Chama a propria função novamente
    requestAnimationFrame(loopGame);
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
        ctx.lineTo(innerWidth, innewrHeight/2);
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
        contador++;

        //MOVE DIAG. NE
        if(linhaNow < linhaInicial && colunaNow > colunaInicial){ 
            mapaView.sqms.forEach( sqm => { sqm.sprite.py +=velocidade; sqm.sprite.px -=velocidade;});
            mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py +=velocidade; sqmBorda.sprite.px -=velocidade;});
            if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
                contador = 0;
                colunaInicial = colunaNow;
                linhaInicial = linhaNow;
                movendo = false;
                createMapView();
            }
        } else
        //MOVE DIAG. NO
        if(linhaNow < linhaInicial && colunaNow < colunaInicial){ 
            mapaView.sqms.forEach( sqm => { sqm.sprite.py +=velocidade; sqm.sprite.px +=velocidade;});
            mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py +=velocidade; sqmBorda.sprite.px +=velocidade;});
            if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
                contador = 0;
                colunaInicial = colunaNow;
                linhaInicial = linhaNow;
                movendo = false;
                createMapView();
            }
        } else
        //MOVE DIAG. SE
        if(linhaNow > linhaInicial && colunaNow > colunaInicial){  
            mapaView.sqms.forEach( sqm => { sqm.sprite.py -=velocidade; sqm.sprite.px -=velocidade;});
            mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py -=velocidade; sqmBorda.sprite.px -=velocidade;});
            if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
                contador = 0;
                colunaInicial = colunaNow;
                linhaInicial = linhaNow;
                movendo = false;
                createMapView();
            }
        } else
        //MOVE DIAG. SO
        if(linhaNow > linhaInicial && colunaNow < colunaInicial){  
            mapaView.sqms.forEach( sqm => { sqm.sprite.py -=velocidade; sqm.sprite.px +=velocidade;});
            mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py -=velocidade; sqmBorda.sprite.px +=velocidade;});
            if(contador >= sqmRenderSizeX || contador >= sqmRenderSizeY){
                contador = 0;
                colunaInicial = colunaNow;
                linhaInicial = linhaNow;
                movendo = false;
                createMapView();
            }
        } else
        //MOVE LESTE
        if(colunaNow > colunaInicial){ 
            mapaView.sqms.forEach( sqm => { sqm.sprite.px -=velocidade; });
            mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.px -=velocidade; });
            //CASO ATINGIU O PROX. SQM
            if(contador >= sqmRenderSizeX){
                contador = 0;
                colunaInicial = colunaNow;
                movendo = false;
                createMapView();
            }
        } else
        //MOVE OESTE
        if(colunaNow < colunaInicial){ 
            mapaView.sqms.forEach( sqm => { sqm.sprite.px +=velocidade; });
            mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.px +=velocidade; });  
            //CASO ATINGIU O PROX. SQM
            if(contador >= sqmRenderSizeX){
                contador = 0;
                colunaInicial = colunaNow;
                movendo = false;
                createMapView();
            }
        } else
        //MOVE SUL
        if(linhaNow > linhaInicial){
            mapaView.sqms.forEach( sqm => { sqm.sprite.py -=velocidade; });
            mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py -=velocidade; }); 
            //CASO ATINGIU O PROX. SQM
            if(contador >= sqmRenderSizeY){
                contador = 0;
                linhaInicial = linhaNow;
                movendo = false;
                createMapView();
            }
        } else
        //MOVE NORT
        if(linhaNow < linhaInicial){
            mapaView.sqms.forEach( sqm => { sqm.sprite.py +=velocidade; });
            mapaView.sqmsBorda.forEach( sqmBorda => { sqmBorda.sprite.py +=velocidade; }); 
            //CASO ATINGIU O PROX. SQM
            if(contador >= sqmRenderSizeY){
                contador = 0;
                linhaInicial = linhaNow;
                movendo = false;
                createMapView();
            }
        } 
    }
}

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

    let tecla = e.code;

    let globalCol = sqmNow.geralInfos.coluna;
    let globalLin = sqmNow.geralInfos.linha;
    let maxGlobalX = 43;
    let maxGlobalY = 31;

    //SE MOVEU PARA CIMA
    if(tecla=='KeyW' && globalCol > 1 && moveN){
        if(movendo==false){
            linhaNow-=1;
            movendo = true;
        }
    }
    //SE MOVEU PARA BAIXO
    if(tecla=='KeyS' && globalCol < maxGlobalY && moveS){
        if(movendo==false){
            linhaNow+=1;
            movendo = true;
        }
    }
    //SE MOVEU PARA ESQ.
    if(tecla=='KeyA' && globalLin > 1 && moveO){
        if(movendo==false){
            colunaNow-=1;
            movendo = true;
        } 
    }
    //SE MOVEU PARA DIR.
    if(tecla=='KeyD' && globalLin < maxGlobalX && moveL){
        if(movendo==false){
            colunaNow+=1;
            movendo = true;
        }
    }  

    //DIAGONAIS
    //CASO MOVEU PARA NO
    if(tecla=='KeyQ' && globalCol > 1  && globalLin > 1  && moveNO){
        if(movendo==false){
            linhaNow-=1;
            colunaNow-=1;
            movendo = true;
        }
    }
    //CASO MOVEU PARA NE
    if(tecla=='KeyE' && globalCol > 1  && globalLin < maxGlobalX  && moveNE){
        if(movendo==false){
            linhaNow-=1;
            colunaNow+=1;
            movendo = true;
        }
    }
    //CASO MOVEU PARA SO
    if(tecla=='KeyZ' && globalCol < maxGlobalY  && globalLin > 1  && moveSO){
        if(movendo==false){
            linhaNow+=1;
            colunaNow-=1;
            movendo = true;
        }
    }
    //CASO MOVEU PARA SE
    if(tecla=='KeyC' && globalCol < maxGlobalY  && globalLin < maxGlobalX  && moveSE){
        if(movendo==false){
            linhaNow+=1;
            colunaNow+=1;
            movendo = true;
        }
    }

})