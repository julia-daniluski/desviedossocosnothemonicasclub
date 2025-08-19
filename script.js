const dino = document.getElementById("dino"); // mostrar variavel dino no html
const cactus = document.getElementById("cactus"); // mostrar variavel cactus no html
const status = document.getElementById("status"); // mostrar variavel status no html
const speedRange = document.getElementById("speedRange"); // mostrar speedRange dino no html
const startButton = document.getElementById("startButton");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");

let gameInterval, timeInterval;
let speed = 2000;
const speedIncrement = 50;
const minSpeed = 500;

let time = 0;
let score = 0;
let passedObstacle = false; // marca se o obstaculo já passou
let highScore = 0; // pontuação máxima

function jump() {
    if (!dino.classList.contains("jump")) {
        dino.classList.add("jump");
        setTimeout(() => dino.classList.remove("jump"), 500);
    }
}

function moveCactus() {
    cactus.style.transition = "none";
    cactus.style.left = "600px";
    passedObstacle = false;
    requestAnimationFrame(() => {
        cactus.style.transition = `left ${speed}ms linear`;
        cactus.style.left = "-30px";
    });
}

function startGame() {
    status.innerHTML = "";
    startButton.style.display = "none";

    time = 0;
    score = 0;
    timeDisplay.textContent = time;
    scoreDisplay.textContent = score;

    speed = 2000 - (speedRange.value - 5) * 150;
    speed = Math.max(minSpeed, speed);

    moveCactus();

    // Contador do jogo
    timeInterval = setInterval(() => {
        time++;
        timeDisplay.textContent = time;
    }, 1000);

    // Loop de colisão
    gameInterval = setInterval(() => {
        let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
        let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

        // Colisão
        if (cactusLeft < 70 && cactusLeft > 0 && dinoBottom <= 20) {
            endGame();
        }

        // Passou pelo obstáculo sem colidir
        if (cactusLeft <= -30 && !passedObstacle) {
            passedObstacle = true;
            score += 2; // ganha 2 pontos por pular
            scoreDisplay.textContent = score;

            speed = Math.max(minSpeed, speed - speedIncrement);
            moveCactus();
        }
    }, 10);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    cactus.style.transition = "none";

    // Atualiza a pontuação máxima
    if (score > highScore) highScore = score;

    status.innerHTML = `
        <div class="game-over">
            Ops! Você perdeu!<br>
            Tempo: ${time}s | Pontos: ${score}<br>
            Pontuação máxima: ${highScore}<br>
            Clique em "Reiniciar" para tentar de novo.
        </div>
        <button onclick="resetGame()">Reiniciar</button>
    `;
}

function resetGame() {
    dino.style.bottom = "0px";
    cactus.style.left = "600px";
    status.innerHTML = "";
    startGame();
}

document.addEventListener("keydown", jump);
startButton.addEventListener("click", startGame);
