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

// Collision resolution logic
function resolveCollisions(ball, otherBall) {
    const dx = otherBall.x - ball.x;
    const dy = otherBall.y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if balls overlap
    if (distance < ball.radius + otherBall.radius) {
        // Simple elastic collision logic
        const angle = Math.atan2(dy, dx);
        const speed1 = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
        const speed2 = Math.sqrt(otherBall.dx ** 2 + otherBall.dy ** 2);

        // Adjust velocities using angles
        ball.dx = speed2 * Math.cos(angle);
        ball.dy = speed2 * Math.sin(angle);
        otherBall.dx = speed1 * Math.cos(angle + Math.PI);
        otherBall.dy = speed1 * Math.sin(angle + Math.PI);

        // Slightly separate balls to prevent sticking
        const overlap = ball.radius + otherBall.radius - distance;
        const separationX = overlap * Math.cos(angle) / 2;
        const separationY = overlap * Math.sin(angle) / 2;

        ball.x -= separationX;
        ball.y -= separationY;
        otherBall.x += separationX;
        otherBall.y += separationY;
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

    // Check for collisions and update each ball
    balls.forEach((ball, i) => {
        for (let j = i + 1; j < balls.length; j++) {
            resolveCollisions(ball, balls[j]);
        }
        ball.update();
    });

    requestAnimationFrame(animate);
}

// Start the animation
animate();
