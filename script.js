const canvas = document.getElementById('bouncingBall');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = []; 

// Ball class
class Ball {
    constructor(x, y, radius, color, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx; // horizontal velocity
        this.dy = dy; // vertical velocity
        this.gravity = 0.981;
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


function resolveCollisions(ball, otherBall) {
    const dx = otherBall.x - ball.x;
    const dy = otherBall.y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if balls overlap
    if (distance < ball.radius + otherBall.radius) {
        // Calculate overlap amount
        const overlap = ball.radius + otherBall.radius - distance;

        // Separate the balls based on their masses (assume equal mass here for simplicity)
        const separationX = (overlap * dx) / distance;
        const separationY = (overlap * dy) / distance;

        ball.x -= separationX / 2; // Move each ball half the overlap distance
        ball.y -= separationY / 2;
        otherBall.x += separationX / 2;
        otherBall.y += separationY / 2;

        // Calculate angle of collision
        const angle = Math.atan2(dy, dx);

        // Ball velocities
        const speed1 = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
        const speed2 = Math.sqrt(otherBall.dx ** 2 + otherBall.dy ** 2);

        // Velocities in the direction of the collision
        const direction1 = Math.atan2(ball.dy, ball.dx);
        const direction2 = Math.atan2(otherBall.dy, otherBall.dx);

        const velocityX1 = speed1 * Math.cos(direction1 - angle);
        const velocityY1 = speed1 * Math.sin(direction1 - angle);
        const velocityX2 = speed2 * Math.cos(direction2 - angle);
        const velocityY2 = speed2 * Math.sin(direction2 - angle);

        // Swap velocities in the collision direction (elastic collision)
        const finalVelocityX1 = velocityX2;
        const finalVelocityX2 = velocityX1;

        // Convert back to original coordinate system
        ball.dx = finalVelocityX1 * Math.cos(angle) - velocityY1 * Math.sin(angle);
        ball.dy = finalVelocityX1 * Math.sin(angle) + velocityY1 * Math.cos(angle);

        otherBall.dx = finalVelocityX2 * Math.cos(angle) - velocityY2 * Math.sin(angle);
        otherBall.dy = finalVelocityX2 * Math.sin(angle) + velocityY2 * Math.cos(angle);
    }
}


canvas.addEventListener('click', (e) => {
    const radius = Math.random() * 20 + 10;
    const x = e.clientX;
    const y = e.clientY;
    const dx = (Math.random() - 0.5) * 8; 
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
