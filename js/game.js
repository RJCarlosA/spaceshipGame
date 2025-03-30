document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreDisplay = document.getElementById("score");
    const levelDisplay = document.getElementById("level");
    const pauseButton = document.getElementById("pauseButton");
    const numberOfLives = document.getElementById("lives");

    let score = 0;
    let level = 1;
    let isPaused = false;
    let lives = 3;

    function resizeCanvas() {
        var padY = window.innerWidth * 0.25;
        var padX = window.innerHeight * 0.25;
        canvas.width = window.innerWidth - padY;
        canvas.height = window.innerHeight - padX;
        ship.x = (canvas.width / 2) - (ship.width / 2);
        ship.y = canvas.height - 60;
    }
    window.addEventListener("resize", resizeCanvas);

    const ship = {
        x: 280,
        y: 350,
        width: 40,
        height: 20,
            speed: 5,
            dx: 0
    };

    let bullets = [];
    let enemyBullets = [];
    let enemies = [];
    let enemyRows = 3;
    let enemyCols = 8;
    const enemyWidth = 40;
    const enemyHeight = 20;
    const enemyPadding = 15;
    let enemyDirection = 1;
    let enemySpeed = 1;

    function createEnemies() {
        enemies = [];
        for (let row = 0; row < enemyRows; row++) {
            for (let col = 0; col < enemyCols; col++) {
                enemies.push({
                    x: col * (enemyWidth + enemyPadding) + 50,
                    y: row * (enemyHeight + enemyPadding) + 50,
                    width: enemyWidth,
                    height: enemyHeight
                });
            }
        }
    }
    createEnemies();

    function drawShip() {
        ctx.fillStyle = "lime";
        ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
    }

    function drawBullets() {
        ctx.fillStyle = "red";
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        ctx.fillStyle = "blue";
        enemyBullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    function drawEnemies() {
        ctx.fillStyle = "yellow";
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function moveShip() {
        ship.x += ship.dx;
        if (ship.x < 0) ship.x = 0;
        if (ship.x + ship.width > canvas.width) ship.x = canvas.width - ship.width;
    }

    function moveBullets() {
        bullets.forEach(bullet => bullet.y -= bullet.speed);
        bullets = bullets.filter(bullet => bullet.y > 0);
        enemyBullets.forEach(bullet => bullet.y += bullet.speed);
        enemyBullets = enemyBullets.filter(bullet => bullet.y < canvas.height);
    }

    function moveEnemies() {
        let changeDirection = false;
        enemies.forEach(enemy => {
            enemy.x += enemySpeed * enemyDirection;
            if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
                changeDirection = true;
            }
        });
        if (changeDirection) {
            enemyDirection *= -1;
            enemies.forEach(enemy => enemy.y += 20);
        }
    }

    function checkCollisions() {
        bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y
                ) {
                    bullets.splice(bIndex, 1);
                    enemies.splice(eIndex, 1);
                    score += 10;
                    scoreDisplay.textContent = score;
                }
            });
        });
        enemyBullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < ship.x + ship.width &&
                bullet.x + bullet.width > ship.x &&
                bullet.y < ship.y + ship.height &&
                bullet.y + bullet.height > ship.y
            ) {
                enemyBullets.splice(bIndex, 1);
                lives--;
                numberOfLives.textContent = lives;
                if (lives <= 0) {
                    alert("Game Over");
                    document.location.reload();
                }
            }
        });
    }

    function shootBullet() {
        bullets.push({
            x: ship.x + ship.width / 2 - 2.5,
            y: ship.y,
            width: 5,
            height: 10,
            speed: 7
        });
    }

    function togglePause() {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? "Return" : "Pause";
        if (!isPaused) gameLoop();
    }

    function enemyShoot() {
        if (enemies.length > 0) {
            let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
            enemyBullets.push({ x: randomEnemy.x + randomEnemy.width / 2, y: randomEnemy.y, width: 5, height: 10, speed: 3 });
        }
    }
    setInterval(enemyShoot, 1500);

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") ship.dx = -ship.speed;
        if (e.key === "ArrowRight") ship.dx = ship.speed;
        if (e.key === " ") shootBullet();
    });
    
    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") ship.dx = 0;
    });

    function gameLoop() {
        if (isPaused) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShip();
        drawBullets();
        drawEnemies();
        moveShip();
        moveBullets();
        moveEnemies();
        checkCollisions();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});