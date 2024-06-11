document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let isJumping = false;
    let isFalling = false;
    let position = 0;
    let platforms = [];
    let obstacles = [];
    let platformSpeedIncreaseInterval = 10000;
    let difficultyIncrease = 0.1;

    document.addEventListener('keydown', control);

    function control(e) {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            if (!isJumping && !isFalling) {
                jump();
            }
        }
    }

    function jump() {
        isJumping = true;
        let jumpHeight = 150;
        let jumpSpeed = 20;
        let intervalUp = setInterval(() => {
            if (jumpHeight <= 0) {
                clearInterval(intervalUp);
                isJumping = false;
                fall();
            }
            position += jumpSpeed;
            jumpHeight -= jumpSpeed;
            player.style.bottom = `${position}px`;
        }, 20);
    }

    function fall() {
        isFalling = true;
        let fallSpeed = 20;
        let intervalDown = setInterval(() => {
            if (position <= 0) {
                clearInterval(intervalDown);
                position = 0;
                player.style.bottom = `${position}px`;
                isFalling = false;
            } else if (checkCollisionWithPlatforms()) {
                clearInterval(intervalDown);
                isFalling = false;
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            } else {
                position -= fallSpeed;
                player.style.bottom = `${position}px`;
            }
        }, 20);
    }

    function createPlatform() {
        const platform = document.createElement('div');
        platform.classList.add('platform');
        platform.style.left = '800px';
        platform.style.bottom = `${Math.random() * 200 + 50}px`;
        platform.style.width = `${Math.random() * 100 + 50}px`;
        gameContainer.appendChild(platform);
        platforms.push({ 
            element: platform, 
            speed: Math.random() * 2 + 1,
            direction: Math.random() < 0.5 ? 1 : -1, // Randomize direction
            verticalSpeed: Math.random() < 0.5 ? 1 : -1 // Randomize vertical direction
        });
    }

    function movePlatforms() {
        platforms.forEach(platformObj => {
            const platform = platformObj.element;
            let platformLeft = parseInt(platform.style.left);
            if (platformLeft < -100) {
                platform.remove();
                platforms = platforms.filter(p => p.element !== platform);
            } else {
                platform.style.left = `${platformLeft - platformObj.speed * platformObj.direction}px`;
                // Make some platforms move up and down
                let platformBottom = parseInt(platform.style.bottom);
                if (platformBottom > 350 || platformBottom < 0) {
                    platformObj.verticalSpeed *= -1;
                }
                platform.style.bottom = `${platformBottom + platformObj.verticalSpeed}px`;
            }
        });
    }

    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = '800px';
        obstacle.style.bottom = `${Math.random() * 200 + 50}px`;
        gameContainer.appendChild(obstacle);
        obstacles.push(obstacle);
    }

    function moveObstacles() {
        obstacles.forEach(obstacle => {
            let obstacleLeft = parseInt(obstacle.style.left);
            if (obstacleLeft < -30) {
                obstacle.remove();
                obstacles = obstacles.filter(o => o !== obstacle);
            } else {
                obstacle.style.left = `${obstacleLeft - 3}px`;
            }
        });
    }

    function checkCollisionWithPlatforms() {
        return platforms.some(platformObj => {
            const platform = platformObj.element;
            const playerRect = player.getBoundingClientRect();
            const platformRect = platform.getBoundingClientRect();
            return (
                playerRect.left < platformRect.right &&
                playerRect.right > platformRect.left &&
                playerRect.bottom > platformRect.top &&
                playerRect.top < platformRect.bottom
            );
        });
    }

    function checkCollisionWithObstacles() {
        return obstacles.some(obstacle => {
            const playerRect = player.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();
            return (
                playerRect.left < obstacleRect.right &&
                playerRect.right > obstacleRect.left &&
                playerRect.bottom > obstacleRect.top &&
                playerRect.top < obstacleRect.bottom
            );
        });
    }

    setInterval(() => {
        platforms.forEach(platformObj => {
            platformObj.speed += difficultyIncrease;
        });
    }, platformSpeedIncreaseInterval);

    function gameLoop() {
        movePlatforms();
        moveObstacles();
        
        if (Math.random() < 0.02) {
            createPlatform();
        }
        
        if (Math.random() < 0.01) {
            createObstacle();
        }
        
        if (checkCollisionWithObstacles()) {
            alert("Game Over");
            // Reset game or handle game over state
            return;
        }
        
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
