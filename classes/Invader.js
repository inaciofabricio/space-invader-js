import { PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Invader {

    constructor(position, velocity) {
        
        this.position = position 
        this.width = 50 * 0.8;
        this.height = 37 * 0.8;
        this.velocity = velocity;
        this.image = this.getImage(PATH_INVADER_IMAGE);

    }

    // Método para carregar uma imagem a partir de um caminho fornecido (path)
    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    // Método para mover o invader para a esquerda
    moveLeft() {
        this.position.x -= this.velocity;
    }

    // Método para mover o invader para a direita
    moveRight() {
        this.position.x += this.velocity;
    }

    // Método para mover o invader para baixo
    moveDown() {
        this.position.y += this.height
    }

    // Método para incrementar a velocidade do invader com um valor de impulso
    incrementVelocity(boost) {
        this.velocity += boost;
    }

    // Método para desenhar o invader no canvas usando a imagem carregada
    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);        
    }

    // Método para fazer o invader disparar um projétil
    shoot(projectiles) {

        const x = this.position.x + (this.width / 2) - 1 ;
        const y = this.position.y + this.height;
        const velocity = 10;

        const projectile = new Projectile({x, y}, velocity);

        projectiles.push(projectile);
    }

    // Método para verificar se o invader foi atingido por um projétil
    hit(projectile) {
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        );
    }

    // Método para verificar se o invader colidiu com um obstáculo
    collided(obstacle) {
        return (
            (obstacle.position.x >= this.position.x &&
                obstacle.position.x <= this.position.x + this.width &&
                obstacle.position.y >= this.position.y &&
                obstacle.position.y <= this.position.y + this.height) ||
            (obstacle.position.x + obstacle.width >= this.position.x &&
                obstacle.position.x <= this.position.x &&
                obstacle.position.y >= this.position.y &&
                obstacle.position.y <= this.position.y + this.height)
        );
    }
}

export default Invader;