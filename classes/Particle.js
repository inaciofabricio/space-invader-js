class Particle {

    constructor(position, velocity, radius, color) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
    }

    // Método responsável por desenhar a partícula no canvas
    draw(ctx) {

        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.opacity;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    // Método responsável por atualizar a posição e a opacidade da partícula
    update() {

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.opacity = this.opacity - 0.008 <= 0 ? 0 : this.opacity - 0.008;
    }
}

export default Particle;