import { PATH_ENGINE_IMAGE, PATH_ENGINE_SPRITES, PATH_SPACESHIP_IMAGE, INITIAL_FRAMES } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player {

    constructor(canvasWidth, canvasHeight) {
        
        this.alive = true
        this.width = 48 * 2;
        this.height = 48 * 2;
        this.velocity = 6;
        
        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30
        } 

        this.image = this.getImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE);
        this.engineSprites = this.getImage(PATH_ENGINE_SPRITES);

        this.sx = 0;
        this.framesCounter = INITIAL_FRAMES;
    }

    // Carrega e retorna uma imagem a partir de um caminho especificado
    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    // Move o jogador para a esquerda, diminuindo a posição x
    moveLeft() {
        this.position.x -= this.velocity;
    }

    // Move o jogador para a direita, aumentando a posição x
    moveRight() {
        this.position.x += this.velocity;
    }

    // Reseta a posição do jogador para o centro da tela
    resetPosition(canvasWidth) {
        this.position.x = canvasWidth / 2 - this.width / 2;       
    }

    // Desenha o jogador e suas animações no contexto do canvas
    draw(ctx) {

        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        ctx.drawImage(
            this.engineSprites,
            this.sx, 
            0,
            48, 
            48,
            this.position.x,
            this.position.y + 5,
            this.width,
            this.height
        );

        ctx.drawImage(this.engineImage, this.position.x, this.position.y + 3, this.width, this.height);

        this.update();
        
    }

    // Atualiza o estado das animações do jogador
    update() {

        if (this.framesCounter === 0) {
            this.sx = this.sx === 96 ? 0 : this.sx + 48;
            this.framesCounter = INITIAL_FRAMES;
        }

        this.framesCounter--;
    }

    // Dispara um projétil para cima a partir da posição do jogador
    shoot(projectiles) {

        const x = this.position.x + (this.width / 2) - 1 ;
        const y = this.position.y;
        const velocity = -10;

        const projectile = new Projectile({x, y}, velocity);

        projectiles.push(projectile);
    }

    // Verifica se o jogador foi atingido por um projétil
    hit(projectile) {
        return (
            projectile.position.x >= this.position.x + 20 &&
            projectile.position.x <= this.position.x + 20 + this.width - 38 &&
            projectile.position.y + projectile.height >= this.position.y + 22 &&
            projectile.position.y + projectile.height <=
                this.position.y + 22 + this.height - 34
        );
    }
}

export default Player;