const canvas = document.getElementById('bouncingBall');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = []; // Store all the balls

// Ball class
class Ball {
    constructor(x, y, radius, color, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx; // horizontal velocity
        this.dy = dy; // vertical velocity
        this.gravity = 0.5;
        this.friction = 0.9; // Energy loss on bounce
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        // Add gravity
        this.dy += this.gravity;

        // Bounce off the bottom
        if (this.y + this.radius + this.dy > canvas.height) {
            this.dy *= -this.friction; // Reverse and reduce speed
            this.y = canvas.height - this.radius;
        }

        // Bounce off the sides
        if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
            this.dx *= -1; // Reverse direction
        }

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create random balls on click
canvas.addEventListener('click', (e) => {
    const radius = Math.random() * 20 + 10;
    const x = e.clientX;
    const y = e.clientY;
    const dx = (Math.random() - 0.5) * 8; // Random horizontal velocity
    const dy = (Math.random() - 0.5) * 8; // Random vertical velocity
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    balls.push(new Ball(x, y, radius, color, dx, dy));
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => ball.update());
    requestAnimationFrame(animate);
}

animate();
