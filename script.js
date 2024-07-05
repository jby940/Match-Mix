document.addEventListener('DOMContentLoaded', function () {    
    const grid = document.getElementById('gameGrid');
    const selectedCategory = localStorage.getItem('selectedCategory');
    const selectedDifficulty = localStorage.getItem('selectedDifficulty');
    const clickSound = new Audio('bgmusic/click.mp3');
    const matchSound = new Audio('bgmusic/match.mp3');

    setDifficulty(selectedDifficulty);

    const category = {
        numbers: ['images/numbers/num1.jfif', 'images/numbers/num2.jfif', 'images/numbers/num3.jfif', 'images/numbers/num4.jfif', 'images/numbers/num5.jfif', 'images/numbers/num6.jfif', 'images/numbers/num7.jfif', 'images/numbers/num8.jfif', 'images/numbers/num9.jfif', 'images/numbers/num10.jfif', 'images/numbers/num11.jfif', 'images/numbers/num12.jfif', 'images/numbers/num13.jfif', 'images/numbers/num14.jfif', 'images/numbers/num15.jfif', 'images/numbers/num16.jfif', 'images/numbers/num17.jfif', 'images/numbers/num18.jfif', 'images/numbers/num19.jfif', 'images/numbers/num20.jfif'],
        letters: ['images/letters/leta.png', 'images/letters/letb.png', 'images/letters/letc.png', 'images/letters/letd.png', 'images/letters/lete.png', 'images/letters/letf.png', 'images/letters/letg.png', 'images/letters/leth.png', 'images/letters/leti.png', 'images/letters/letj.png', 'images/letters/letk.png', 'images/letters/letl.png', 'images/letters/letm.png', 'images/letters/letn.png', 'images/letters/leto.png', 'images/letters/letp.png', 'images/letters/letq.png', 'images/letters/letr.png', 'images/letters/lets.png', 'images/letters/lett.png'],
        colors: ['images/colors/col1.png','images/colors/col2.png', 'images/colors/col3.png', 'images/colors/col4.png', 'images/colors/col5.png', 'images/colors/col6.png', 'images/colors/col7.png', 'images/colors/col8.png', 'images/colors/col9.png', 'images/colors/col10.png', 'images/colors/col11.png', 'images/colors/col12.png', 'images/colors/col13.png', 'images/colors/col14.png', 'images/colors/col15.png', 'images/colors/col16.png', 'images/colors/col17.png', 'images/colors/col18.png', 'images/colors/col19.png','images/colors/col20.png'],
        fruits: ['images/fruits/apple.png', 'images/fruits/avocado.png', 'images/fruits/banana.png', 'images/fruits/blueberry.png', 'images/fruits/cherry.png', 'images/fruits/dragonfruit.png', 'images/fruits/papaya.png', 'images/fruits/grapes.png', 'images/fruits/raspberry.png', 'images/fruits/guava.png', 'images/fruits/kiwi.png', 'images/fruits/lemon.png', 'images/fruits/lychee.png', 'images/fruits/mango.png', 'images/fruits/orange.png', 'images/fruits/peach.png', 'images/fruits/pineapple.png', 'images/fruits/rambutan.png', 'images/fruits/strawberry.png', 'images/fruits/watermelon.png'],
        animals: ['images/animals/bear.png', 'images/animals/bee.png', 'images/animals/bird.png', 'images/animals/butterfly.png', 'images/animals/cat.png', 'images/animals/cow.png', 'images/animals/deer.png', 'images/animals/dog.png', 'images/animals/elephant.png', 'images/animals/giraffe.png', 'images/animals/horse.png', 'images/animals/lion.png', 'images/animals/monkey.png', 'images/animals/panda.png', 'images/animals/penguin.png', 'images/animals/pig.png', 'images/animals/rabbit.png', 'images/animals/snake.png', 'images/animals/whale.png', 'images/animals/zebra.png'],
        symbols: ['images/symbols/circle.png', 'images/symbols/cloud.png', 'images/symbols/clover.png', 'images/symbols/club.png', 'images/symbols/diamond.png', 'images/symbols/divide.png', 'images/symbols/equal.png', 'images/symbols/heart.png', 'images/symbols/minus.png', 'images/symbols/moon.png', 'images/symbols/plus.png', 'images/symbols/shield.png', 'images/symbols/smile.png', 'images/symbols/spade.png', 'images/symbols/square.png', 'images/symbols/star.png', 'images/symbols/sun.png', 'images/symbols/thunder.png', 'images/symbols/times.png', 'images/symbols/triangle.png']
    };

    const difficultyConfig = {
        'easy': 3,
        'medium': 4,
        'hard': 5
    };

    const itemsPerTile = difficultyConfig[selectedDifficulty] || 3;
    const totalItems = 8 * itemsPerTile / 2;
    const categoryData = category[selectedCategory];
    const items = categoryData.slice(0, totalItems).concat(categoryData.slice(0, totalItems));
    items.sort(() => 0.5 - Math.random());

    const gameState = {
        flippedItems: [],
        matchedPairs: 0,
        currentPlayer: 1,
        scores: [0, 0],
        memorizationPhase: true,
        turnTimer: null,
        canMoveTile: false
    };

    const playerElements = {
        1: document.getElementById('player1'),
        2: document.getElementById('player2')
    };

    const movePrompt = document.getElementById('movePrompt');
    movePrompt.style.display = 'block';

    const matchPrompt = document.getElementById('matchPrompt');
    matchPrompt.style.display = 'none';
    

    // Generate tiles and items
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');

        if (i < 8) {
            for (let j = 0; j < itemsPerTile; j++) {
                const item = items.pop();
                const tileItem = document.createElement('div');
                tileItem.classList.add('tile-item');
                tileItem.dataset.value = item;

                const img = document.createElement('img');
                img.src = item;
                img.alt = item;
                tileItem.appendChild(img);

                tile.appendChild(tileItem);
                tileItem.addEventListener('click', onTileItemClick);
            }
        } else {
            tile.classList.add('empty');
        }

        grid.appendChild(tile);
    }

    startMemoryPhase();

    function startMemoryPhase() {
        movePrompt.textContent = 'Memorize it!';
        const timerElement = document.getElementById('timer');
        let timer = 10;
    
        const countdown = setInterval(() => {
            timer--;
            timerElement.textContent = formatTime(timer);
            if (timer <= 0) {
                clearInterval(countdown);
                hideItems();
                gameState.memorizationPhase = false;
                movePrompt.textContent = `Player ${gameState.currentPlayer} MATCH TIME!`;
                startTurnTimer();
            }
        }, 1000);
    }
    
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play();
    }
    
    function playMatchSound() {
        matchSound.currentTime = 0;
        matchSound.play();
    }

    function hideItems() {
        const tileItems = document.querySelectorAll('.tile-item img');
        tileItems.forEach(img => {
            img.parentElement.classList.add('hidden');
            img.style.visibility = 'hidden';
        });
    }

    function onTileItemClick(event) {
        if (gameState.memorizationPhase) {
            return;
        }

        if (gameState.canMoveTile) {
            return;
        }

        const item = event.currentTarget;
        const img = item.querySelector('img');

        if (gameState.flippedItems.length === 2 || item.classList.contains('flipped') || item.classList.contains('matched')) {
            return;
        }

        img.style.visibility = 'visible';
        item.classList.add('flipped');
        gameState.flippedItems.push(item);

        playClickSound();

        if (gameState.flippedItems.length === 1) {
            matchPrompt.textContent = `Player ${gameState.currentPlayer} MATCH TIME!`;
            matchPrompt.style.display = 'block';
        }

        if (gameState.flippedItems.length === 2) {
            clearTimeout(gameState.turnTimer);
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [item1, item2] = gameState.flippedItems;
        const img1 = item1.querySelector('img');
        const img2 = item2.querySelector('img');

        matchPrompt.style.display = 'none';

        if (item1.dataset.value === item2.dataset.value) {
            item1.classList.add('matched');
            item2.classList.add('matched');
            img1.parentElement.style.backgroundColor = 'green';
            img2.parentElement.style.backgroundColor = 'green';
            playMatchSound();

            gameState.scores[gameState.currentPlayer - 1]++;
            updateScoreDisplay();
            gameState.flippedItems = [];
            resetTurnTimerBar();
            startTurnTimer();
            checkForWinner();
        } else {
            setTimeout(() => {
                img1.style.visibility = 'hidden';
                img2.style.visibility = 'hidden';
                item1.classList.remove('flipped');
                item2.classList.remove('flipped');
                gameState.flippedItems = [];
                promptTileMove();
            }, 1000);
        }
    }

    function switchPlayer() {
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        updateActivePlayerDisplay();
        matchPrompt.textContent = `Player ${gameState.currentPlayer} MATCH TIME!`;
        resetTurnTimerBar();
        startTurnTimer();
    }

    function updateActivePlayerDisplay() {
        Object.values(playerElements).forEach(player => player.classList.remove('active'));
        playerElements[gameState.currentPlayer].classList.add('active');
    }

    function updateScoreDisplay() {
        document.getElementById('score1').textContent = gameState.scores[0];
        document.getElementById('score2').textContent = gameState.scores[1];
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function resetTurnTimerBar() {
        const turnTimerBar = document.getElementById('turnTimerBar');
        turnTimerBar.style.width = '100%';
        turnTimerBar.style.transition = 'none';
        turnTimerBar.offsetHeight;
        turnTimerBar.style.transition = 'width 15s linear';
    }

    function startTurnTimer() {
        const turnTimerBar = document.getElementById('turnTimerBar');
        turnTimerBar.style.width = '100%';
        turnTimerBar.style.transition = 'width 15s linear';

        turnTimerBar.offsetHeight;
        turnTimerBar.style.width = '0%';

        if (gameState.turnTimer) {
            clearTimeout(gameState.turnTimer);
        }

        gameState.turnTimer = setTimeout(() => {
            const flippedItems = gameState.flippedItems;

            if (flippedItems.length === 0) {
                promptTileMove();
            } else if (flippedItems.length === 1) {
                const [item] = flippedItems;
                const img = item.querySelector('img');

                img.style.visibility = 'hidden';
                item.classList.remove('flipped');
                gameState.flippedItems = [];

                promptTileMove();
            } else if (flippedItems.length === 2) {
                turnTimerBar.style.width = '0%';
                promptTileMove();
            }
        }, 15000);
    }

    function promptTileMove() {
        gameState.canMoveTile = true;
        movePrompt.textContent = `Player ${gameState.currentPlayer} MIX TIME!`;
        movePrompt.style.display = 'block';
        
        const tiles = Array.from(document.querySelectorAll('.tile'));
        const emptyTileIndex = tiles.findIndex(tile => tile.classList.contains('empty'));
        const adjacentIndices = getAdjacentIndices(emptyTileIndex);

        adjacentIndices.forEach(index => {
            tiles[index].classList.add('movable');
            tiles[index].addEventListener('click', onMoveTileClick);
        });
    }

    function onMoveTileClick(event) {
        if (!gameState.canMoveTile) {
            return;
        }

        const selectedTile = event.currentTarget;
        const tiles = Array.from(document.querySelectorAll('.tile'));
        const emptyTileIndex = tiles.findIndex(tile => tile.classList.contains('empty'));

        tiles[emptyTileIndex].innerHTML = selectedTile.innerHTML;
        tiles[emptyTileIndex].classList.remove('empty');
        selectedTile.innerHTML = '';
        selectedTile.classList.add('empty');

        const movedTileItems = tiles[emptyTileIndex].querySelectorAll('.tile-item');
        movedTileItems.forEach(tileItem => {
            tileItem.addEventListener('click', onTileItemClick);
        });

        gameState.canMoveTile = false;
        removeMoveableHighlights();
        movePrompt.style.display = 'none';

        switchPlayer();
    }

    function removeMoveableHighlights() {
        const tiles = Array.from(document.querySelectorAll('.tile'));
        tiles.forEach(tile => {
            tile.classList.remove('movable');
            tile.removeEventListener('click', onMoveTileClick);
        });
    }

    function getAdjacentIndices(emptyTileIndex) {
        const adjacentIndices = [];
        const row = Math.floor(emptyTileIndex / 3);
        const col = emptyTileIndex % 3;

        if (row > 0) adjacentIndices.push(emptyTileIndex - 3); // Above
        if (row < 2) adjacentIndices.push(emptyTileIndex + 3); // Below
        if (col > 0) adjacentIndices.push(emptyTileIndex - 1); // Left
        if (col < 2) adjacentIndices.push(emptyTileIndex + 1); // Right

        return adjacentIndices;
    }

    function setDifficulty(difficulty) {
        const bodyElement = document.body;
        bodyElement.classList.remove('easy', 'medium', 'hard');
        bodyElement.classList.add(difficulty);
    }

    function checkForWinner() {
        const totalPairs = totalItems;
        const halfPairs = Math.floor(totalPairs / 2);
        if (gameState.scores[0] >= halfPairs) {
            displayWinner(1);
        } else if (gameState.scores[1] >= halfPairs) {
            displayWinner(2);
        }
    }

    function displayWinner(player) {
        const winnerPrompt = document.getElementById('winnerPrompt');
        winnerPrompt.textContent = `Player ${player} Wins!`;
        winnerPrompt.style.display = 'block';
        grid.style.pointerEvents = 'none';

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.addEventListener('click', restartGame);
        winnerPrompt.appendChild(restartButton);
    }
    
    function restartGame() {
        grid.innerHTML = '';
        winnerPrompt.style.display = 'none';
        window.location.href = 'index.html';
    }

    restartButton.addEventListener('click', restartGame);
});
