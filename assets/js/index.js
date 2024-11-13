import Grid from "../../classes/Grid.js";
import Obstacle from "../../classes/Obstacle.js";
import Particle from "../../classes/Particle.js";
import Player from "../../classes/Players.js";
import SoundEffects from "../../classes/SoundEffects.js";
import { GameState } from "../../utils/constants.js";

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");
const newRecord = document.getElementById("newRecord");
const newRecordValue = document.getElementById("newRecordValue");

// Seleciona o elemento <canvas> do documento e o armazena na constante 'canvas'
const canvas = document.querySelector("canvas");

// Define a largura e altura do canvas para igualar o tamanho da janela
canvas.width = innerWidth;
canvas.height = innerHeight;

// Obtém o contexto 2D do canvas, necessário para desenhar formas, textos, etc.
const ctx = canvas.getContext("2d");

// Desativa o alisamento de imagem, mantendo as bordas das imagens pixeladas ao redimensioná-las
ctx.imageSmoothingEnabled = false;

let currentState = GameState.START;

const gameData = {
    score: 0,
    level: 1,
    high: localStorage.getItem("highScore") || 0,
};

// Cria uma nova instância de SoundEffects para gerenciar os efeitos sonoros do jogo
const soundEffects = new SoundEffects();

// Cria uma nova instância do jogador (Player), posicionando-o dentro dos limites do canvas
const player = new Player(canvas.width, canvas.height);

// Cria uma nova instância de Grid com dimensões aleatórias entre 1 e 10 para linhas e colunas
const grid = new Grid(
    Math.round(Math.random() * 9 + 1),
    Math.round(Math.random() * 9 + 1)
);

const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true,
    } 
}

// Função para incrementar a pontuação do jogo
// Adiciona o valor especificado à pontuação atual e atualiza a pontuação máxima se necessário
const incrementScore = (value) => {
    
    gameData.score += value;

    if (gameData.score > gameData.high) {
        gameData.high = gameData.score;
    }
};

// Função para exibir os dados do jogo na interface
// Atualiza os elementos de pontuação, nível e recorde com os valores atuais de gameData
const showGameData = () => {
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.high;
};

// Função para inicializar os obstáculos no jogo
// Cria dois obstáculos posicionados simetricamente no eixo X e os adiciona ao array de obstáculos
const initObstacles = () => {

    const x = canvas.width / 2 - 50;
    const y = canvas.height - 250;
    const offset = canvas.width * 0.15;
    const color = "red";

    const obstacle1 = new Obstacle({ x: x - offset, y }, 100, 20, color);
    const obstacle2 = new Obstacle({ x: x + offset, y }, 100, 20, color);

    obstacles.push(obstacle1);
    obstacles.push(obstacle2);
};

// Função para desenhar todos os obstáculos no canvas
// Itera sobre o array de obstáculos e chama o método de desenho de cada um, passando o contexto 2D
const drawObstacles = () => {
    obstacles.forEach((obstacle) => obstacle.draw(ctx));
};

// Função para desenhar e atualizar todos os projéteis no canvas
// Combina os projéteis do jogador e dos invasores, e os desenha e atualiza no canvas
const drawProjectiles = () => {

    const projectiles = [...playerProjectiles, ...invaderProjectiles];

    projectiles.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.update();
    });
}

// Função para remover projéteis do jogador que saem da tela
// Itera sobre os projéteis do jogador e remove os que alcançam o topo da tela (y <= 0)
const clearProjectiles = () => {
    playerProjectiles.forEach((projectile, index) => {
        if(projectile.position.y <= 0) {
            playerProjectiles.splice(index, 1)
        }
    });
}

// Função para verificar se um projétil do jogador atingiu um invasor
// Itera sobre os invasores e projéteis, e se ocorrer uma colisão, executa as ações correspondentes
const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if (invader.hit(projectile)) {
                soundEffects.playHitSound(); 

                createExplosion(
                    {
                        x: invader.position.x + invader.width / 2,
                        y: invader.position.y + invader.height / 2,
                    },
                    10,
                    "#941CFF"
                );

                incrementScore(10);

                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);

                return;
            }
        });
    });
};

// Função para verificar se um projétil de invasor atingiu o jogador
// Itera sobre os projéteis dos invasores e, se ocorrer uma colisão com o jogador, executa as ações correspondentes
const checkShootPlayer = () => {
    invaderProjectiles.some((projectile, index) => {
        if (player.hit(projectile)) {
            soundEffects.playExplosionSound();
            invaderProjectiles.splice(index, 1); // Remove o projétil do invasor
            gameOver();
        }
    });
};

// Função para encerrar o jogo quando o jogador morre
// Cria várias explosões ao redor do jogador, marca o jogador como morto e altera o estado do jogo para "GAME_OVER"
const gameOver = () => {
    createExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        10,
        "white"
    );

    createExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        5,
        "#4D9BE6"
    );

    createExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        5,
        "red"
    );

    player.alive = false;
    currentState = GameState.GAME_OVER;
  
    const highScore = localStorage.getItem("highScore");

    if(highScore < gameData.score) {
        localStorage.setItem("highScore", gameData.score);
        newRecordValue.textContent = gameData.score;
        gameOverScreen.append(newRecord);
    }

    showGameOverScreen();
};

// Função para exibir a tela de Game Over
// Adiciona a tela de Game Over ao corpo do documento e aplica a animação de zoom
const showGameOverScreen = () => {
    document.body.append(gameOverScreen);
    gameOverScreen.classList.add("zoom-animation");
};

// Função para desenhar e atualizar todas as partículas no canvas
// Itera sobre o array de partículas, desenhando e atualizando cada uma delas
const drawParticles = () => {
    particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update();
    });
};

// Função para remover partículas que desapareceram (opacidade <= 0)
// Itera sobre o array de partículas e remove aquelas cuja opacidade é menor ou igual a 0
const clearParticles = () => {
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            particles.splice(i, 1);
        }
    });
};

// Função para criar uma explosão gerando partículas aleatórias
// Cria um número de partículas baseado no tamanho especificado e adiciona ao array de partículas
const createExplosion = (position, size, color) => {
    for (let i = 0; i < size; i += 1) {
        const particle = new Particle(
            {
                x: position.x,
                y: position.y,
            },
            {
                x: (Math.random() - 0.5) * 1.5,
                y: (Math.random() - 0.5) * 1.5,
            },
            2,
            color
        );

        particles.push(particle);
    }
};

// Função para gerar uma nova grade de invasores quando a anterior é destruída
// Reinicia a grade com um número aleatório de linhas e colunas, inicia novos obstáculos se necessário e avança para o próximo nível
const spawnGrid = () => {

    if (grid.invaders.length === 0) {
        soundEffects.playNextLevelSound();

        grid.rows = Math.round(Math.random() * 9 + 1);
        grid.cols = Math.round(Math.random() * 9 + 1);
        grid.restart();

        incrementLevel();

        if (obstacles.length === 0) {
            initObstacles();
        }
    }
};

// Função para incrementar o nível do jogo
// Aumenta o nível em 1 no objeto gameData
const incrementLevel = () => {
    gameData.level += 1;
};

// Função para verificar se algum projétil colidiu com os obstáculos
// Itera sobre os obstáculos e verifica colisões com projéteis do jogador e dos invasores
// Se houver colisão, o projétil correspondente é removido
const checkShootObstacles = () => {
    
    obstacles.forEach((obstacle) => {
        playerProjectiles.some((projectile, index) => {
            if (obstacle.hit(projectile)) {
                playerProjectiles.splice(index, 1);
                return;
            }
        });

        invaderProjectiles.some((projectile, index) => {
            if (obstacle.hit(projectile)) {
                invaderProjectiles.splice(index, 1);
                return;
            }
        });
    });
};

// Função para verificar se algum invasor colidiu com um obstáculo
// Itera sobre os obstáculos e verifica se algum invasor colidiu com eles
// Se houver colisão, o obstáculo correspondente é removido
const checkInvadersCollidedObstacles = () => {
    obstacles.forEach((obstacle, i) => {
        grid.invaders.some((invader) => {
            if (invader.collided(obstacle)) {
                obstacles.splice(i, 1);
            }
        });
    });
};

// Função para verificar se o jogador colidiu com algum invasor
// Verifica se algum invasor está dentro da área ocupada pelo jogador
// Se houver colisão, o jogo é encerrado chamando a função gameOver
const checkPlayerCollidedInvaders = () => {
    grid.invaders.some((invader) => {
        if (
            invader.position.x >= player.position.x &&
            invader.position.x <= player.position.x + player.width &&
            invader.position.y >= player.position.y
        ) {
            gameOver();
        }
    });
};

// Função principal do loop de jogo
// Atualiza e desenha todos os elementos do jogo, como projéteis, partículas, obstáculos, invasores e jogador, 
// além de verificar colisões e controlar a movimentação do jogador. Também lida com a transição de estados de jogo 
// (jogo em andamento ou game over)
const gameLoop = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState === GameState.PLAYING) {

        showGameData();
        spawnGrid();
    
        drawProjectiles();
        clearProjectiles();
    
        drawParticles();
        clearParticles();
    
        checkShootInvaders();
        checkShootPlayer();

        drawObstacles();
        checkShootObstacles();
        checkInvadersCollidedObstacles();
        checkPlayerCollidedInvaders();
    
        grid.draw(ctx);
        grid.update(player.alive);
    
        ctx.save();
    
        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height /2
        )
    
        if(keys.shoot.pressed && keys.shoot.released) {
            soundEffects.playShootSound();
            player.shoot(playerProjectiles);
            keys.shoot.released = false;
        }
    
        if(keys.left && player.position.x >= 0) {
            player.moveLeft();
            ctx.rotate(-0.15);
        }
        
        if(keys.right && (player.position.x <= canvas.width - player.width - 10)) {
            player.moveRight();
            ctx.rotate(0.15);
        }
    
        ctx.translate(
            - player.position.x - player.width / 2,
            - player.position.y - player.height /2
        )
    
        player.draw(ctx);
    
        ctx.restore();        
    }

    if (currentState === GameState.GAME_OVER) {

        checkShootObstacles();

        drawProjectiles();
        drawParticles();
        drawObstacles();

        clearProjectiles();
        clearParticles();

        grid.draw(ctx);
        grid.update(player.alive);
    }    
    
    requestAnimationFrame(gameLoop);
}

// Adiciona um ouvinte de evento para quando uma tecla é pressionada (keydown)
// Atualiza o estado das teclas de movimento e disparo de acordo com as teclas pressionadas
addEventListener("keydown", (event) => {

    const key = event.key.toLowerCase();
    const code = event.code.toLowerCase();

    if(key === "a" || key === "arrowleft") {
        keys.left = true;
    }

    if(key === "d" || key === "arrowright") {
        keys.right = true;
    }

    if (key === "enter" || (code === "space" || key === " ")) {
        keys.shoot.pressed = true;
    } 
});

// Adiciona um ouvinte de evento para quando uma tecla é solta (keyup)
// Atualiza o estado das teclas de movimento e disparo ao liberar uma tecla
addEventListener("keyup", (event) => {

    const key = event.key.toLowerCase();
    const code = event.code.toLowerCase();

    if(key === "a" || key === "arrowleft") {
        keys.left = false;
    }

    if(key === "d" || key === "arrowright") {
        keys.right = false;
    }

    if (key === "enter" || (code === "space" || key === " ")) {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

// Adiciona um ouvinte de evento para quando o botão do mouse é pressionado (mousedown)
// Marca o estado de disparo como ativo quando o mouse é pressionado
addEventListener("mousedown", () => {
    keys.shoot.pressed = true;
});

// Adiciona um ouvinte de evento para quando o botão do mouse é solto (mouseup)
// Marca o estado de disparo como não pressionado e registrado como liberado quando o botão do mouse é solto
addEventListener("mouseup", () => {
    keys.shoot.pressed = false;
    keys.shoot.released = true;
});

// Adiciona um ouvinte de evento para o clique no botão "Play"
// Inicia o jogo, removendo a tela inicial, mostrando a interface de pontuação e iniciando o loop de disparos dos invasores
buttonPlay.addEventListener("click", () => {

    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;

    setInterval(() => {

        const invader = grid.getRandomInvader();

        if (invader) {
            invader.shoot(invaderProjectiles);
        }
    }, 1000);
});

// Adiciona um ouvinte de evento para o clique no botão "Restart"
// Reinicia o jogo, removendo a tela de "Game Over", resetando as variáveis e preparando o jogo para uma nova partida
buttonRestart.addEventListener("click", () => {

    newRecord.remove();
    gameOverScreen.remove(); 
    currentState = GameState.PLAYING; 

    player.alive = true; 

    grid.invaders.length = 0;
    grid.invadersVelocity = 1;

    invaderProjectiles.length = 0;
    gameData.score = 0;
    gameData.level = 0;

    player.resetPosition(canvas.width);
});

newRecord.remove();
gameOverScreen.remove();
ctx.drawImage;

initObstacles();
gameLoop();

