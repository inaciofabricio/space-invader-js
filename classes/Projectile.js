class Projectile {

    constructor(position, velocity) {
        this.position = position;
        this.width = 2;
        this.height = 20;
        this.velocity = velocity;
    }

    // Desenha o projétil no contexto do canvas usando um retângulo branco
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    // Atualiza a posição do projétil movendo-o para baixo de acordo com sua velocidade
    update() {
        this.position.y += this.velocity;
    }
}

export default Projectile;