
const FLAG = '🚩';
const FIND = '🏳️';
var gBoard;

var gLevel = { SIZE: 4, MINES: 2 };

var gGame = { isOn: false, isHint: false, isCreateMode: false, gLives: 3, gFinds: 3, isSafeClick: false, shownCount: 0, markedCount: 0, secsPassed: 0 };

var gStopwatchInterval;
//prevets the default menu from showing
document.querySelector('.board').addEventListener('contextmenu', function (e) {
    e.preventDefault();

}, false);

//initializing the game
function initGame() {
    gLives = 3;
    gFinds = 3;
    document.querySelector('.safe-click span').innerText = gGame.gFinds;
    document.querySelector('.msg-user').innerHTML = ``;
    document.querySelector('.btn-manual').classList.remove('hide');
    document.querySelector('.lives').innerHTML = '<span class="life"><img src="img/heart.png"></span><span class="life"><img src="img/heart.png"></span><span class="life"><img src="img/heart.png"></span>';
    gGame.isOn = true;
    gGame.isHint = false;
    document.querySelector('.boom').classList.add('hide');
    document.querySelector('.hints').innerHTML = '';
    clearInterval(gStopwatchInterval);
    document.querySelector('.stopwatch span').innerText = 0;
    document.querySelector('.smiley').innerHTML = '<span id="main-smiley" onclick="initGame()"><img src="img/happy.png"></span>';
    if (gLevel.SIZE === 4 && localStorage.beginner) document.querySelector('.highscore span').innerText = localStorage.beginner;
    if (gLevel.SIZE === 8 && localStorage.medium) document.querySelector('.highscore span').innerText = localStorage.medium;
    if (gLevel.SIZE === 12 && localStorage.expert) document.querySelector('.highscore span').innerText = localStorage.expert;
    gBoard = buildBoard();
    renderBoard(gBoard);
}

// building the board in the model
function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
        }
    }
    return board;
}

function useSafeClick() {
    if (gGame.gFinds === 0) return;
    if (gGame.isHint) return;
    if (!IsThereSafeCell) return;
    gGame.isSafeClick = true;
    gGame.gFinds--;
    document.querySelector('.safe-click span').innerText = gGame.gFinds;
    markSafeClick();
}

function markSafeClick() {
    var rndRow = getRandomInt(0, gBoard.length);
    var rndCol = getRandomInt(0, gBoard[0].length);
    while (gBoard[rndRow][rndCol].isMine || gBoard[rndRow][rndCol].isShown) {
        rndRow = getRandomInt(0, gBoard.length);
        rndCol = getRandomInt(0, gBoard[0].length);
    }
    document.querySelector(`[data-i="${rndRow}"][data-j="${rndCol}"]`).innerText = FIND;
    setTimeout(function () {
        document.querySelector(`[data-i="${rndRow}"][data-j="${rndCol}"]`).innerText = '';
        gGame.isSafeClick = false;
    }, 2000)
}
//checks whether there is an infinite loop when it checks if there is a safe cell when you safe click
function IsThereSafeCell() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine) return true;
        }
    }
    return false;
}


function useHint(elHint) {
    if (gGame.isSafeClick) return;
    gGame.isHint = true;
    elHint.classList.add('hide');
    document.body.style.cursor = 'url("img/cursor-with-question-mark.png")';
}

function decreaseLife() {
   //document.querySelector('.life:not(.hide)').classList.add('hide');
}

function revealCellsHint(row, col) {
    var cellsDisappearHint = revealNgsAndSelf(row, col);
    setTimeout(disappearNgsandSelf, 1000, cellsDisappearHint);
}
function revealNgsAndSelf(row, col) {
    var cellsDisappearHint = [];
    var location = {};
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true;
                location = { row: i, col: j }
                cellsDisappearHint.push(location);
            }
        }
    }
    renderBoard(gBoard);
    return cellsDisappearHint;
}

function showGlimpse(cell) {
    cell.isShown = true;
    renderBoard(gBoard);
    cell.isShown = false;
    setTimeout(renderBoard, 1000, gBoard);
}

function disappearNgsandSelf(cellsDisappearHint) {
    for (var i = 0; i < cellsDisappearHint.length; i++) {
        var row = cellsDisappearHint[i].row;
        var col = cellsDisappearHint[i].col;
        gBoard[row][col].isShown = false;
    }
    gGame.isHint = false;
    renderBoard(gBoard);
}

function manuallyPosition() {
    gGame.isCreateMode = true;
    document.querySelector('.btn-manual').classList.add('hide');
    updateRemainingMines();
}

function updateRemainingMines() {
    document.querySelector('.msg-user').innerHTML = `Remaining Mines to position: <span>${gLevel.MINES}</span>`;
}

function setDifficulty(elButton) {
    if (elButton.innerText === 'Beginner') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        initGame();
    }
    if (elButton.innerText === 'Medium') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        initGame();
    }
    if (elButton.innerText === 'Expert') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        initGame();
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countMineNegs(board, i, j);
        }
    }
}

function countMineNegs(board, row, col) {
    var count = 0;
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === row && j === col) continue;
            if (board[i][j].isMine) count++;
        }
    }
    return count;
}

//printing the board in the view
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {

            var className = 'cell';
            var cell = '';

            if (board[i][j].isShown) {
                className += ' shown';
                if (board[i][j].isMine) className += ' mine';
                else {
                    if (board[i][j].minesAroundCount === 0) cell = '';
                    else cell = board[i][j].minesAroundCount;
                }
            }
            else {
                if (board[i][j].isMarked) {
                    className += ' marked';
                    cell = FLAG;
                }
                else {
                    cell = '';
                }
            }

            strHTML += '\t<td class="' + className + '"' + ` data-i="${i}" data-j="${j}"`
                + ' oncontextmenu="cellMarked(this)" onclick="cellClicked(this)">' + cell + ' </td>\n'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function cellMarked(elCell) {
    var i = +elCell.dataset.i;
    var j = +elCell.dataset.j;
    if (gBoard[i][j].isMarked){
         gBoard[i][j].isMarked = false;
    }
    else{ 
        gBoard[i][j].isMarked = true;
    }
    if (checkGameOver()) gameWon();
    renderBoard(gBoard);
}

function cellClicked(elCell) {
    var i = +elCell.dataset.i;
    var j = +elCell.dataset.j;
    if (gGame.isCreateMode) {
        console.log('create mode');
        if (gBoard[i][j].isMine) {
            document.querySelector('.msg-user').innerHTML = 'There is already a mine in that location';
            
            return;
        }
        gLevel.MINES--;
        gBoard[i][j].isMine = true;
        updateRemainingMines();
        showGlimpse(gBoard[i][j]);

        if (gLevel.MINES === 0) {
            gGame.isCreateMode = false;
            document.querySelector('.msg-user').innerHTML = 'You can start to play';
        }
        return;
    }
    if (gGame.isHint) {
        console.log('hint mode');
        revealCellsHint(i, j);
        return;
    }
    if (gBoard[i][j].isShown || !gGame.isOn || gBoard[i][j].isMarked) {
        console.log('do nothing');
        return;
    }
    if (isFirstClick() && !gGame.isCreateMode) {
        console.log('first click');
        document.querySelector('.msg-user').innerHTML = '';
        var start = Date.now();
        gStopwatchInterval = setInterval(stopwatch, 1000, start);
        genRndMines(gBoard, gLevel.MINES, i, j);
        setMinesNegsCount(gBoard);
        showHints();
        document.querySelector('.btn-manual').classList.add('hide');
    }
    gBoard[i][j].isShown = true;
    if (gBoard[i][j].minesAroundCount === 0) expandShown(gBoard, elCell);
    if (gBoard[i][j].isMine) {
        gLives--;
        decreaseLife();
        indicateMine();
        gBoard[i][j].isShown = false;
        if (gLives === 0) gameLost();
    }
    if (checkGameOver()) gameWon();
    renderBoard(gBoard);
}

function indicateMine() {
    document.querySelector('.boom').classList.remove('hide');
    setTimeout(function () {
        document.querySelector('.boom').classList.add('hide');
    }, 1000)
}

function showHints() {
    document.querySelector('.hints').innerHTML = '<span class="hint" onclick="useHint(this)"><img src="img/bulb.png"></span>'
        + '<span class="hint" onclick="useHint(this)"><img src="img/bulb.png"></span>'
        + '<span class="hint" onclick="useHint(this)"><img src="img/bulb.png"></span>';
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function stopwatch(start) {
    var currTime = Date.now();
    gGame.secsPassed = Math.floor((currTime - start) / 1000);
    document.querySelector('.stopwatch span').innerText = gGame.secsPassed;
}

function isFirstClick() {
    for (var i = 0; i < gBoard.length; i++) {
        for (j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown) return false;
        }
    }
    return true;
}

function genRndMines(board, minesN, i, j) {
    for (var k = 0; k < minesN; k++) {
        var rndRow = getRandomInt(0, board.length);
        var rndCol = getRandomInt(0, board[0].length);
        var cell = board[rndRow][rndCol];
        while (cell.isMine || (rndRow <= i + 1 && rndRow >= i - 1 && rndCol <= j + 1 && rndCol >= j - 1)) {
            rndRow = getRandomInt(0, board.length);
            rndCol = getRandomInt(0, board[0].length);
            cell = board[rndRow][rndCol];
        }
        cell.isMine = true;
    }
}

function gameLost() {
    gGame.isOn = false;
    clearInterval(gStopwatchInterval);
    minesRevealed();
    document.querySelector('.msg-user').innerText = 'You Lost! click the smiley to restart';
    document.querySelector('.msg-user').classList.remove('hide');
    document.querySelector('.boom').classList.remove('hide');
    setTimeout(function () {
        document.querySelector('.boom').classList.add('hide');
    }, 1000)
    document.querySelector('.smiley').innerHTML = '<span id="sad-smiley" onclick="initGame()"><img src="img/dead.png"></span>';

}

function gameWon() {
    gLevel.isOn = false;
    clearInterval(gStopwatchInterval);
    if (gLevel.SIZE === 4) {
        if (!localStorage.beginner) localStorage.beginner = gGame.secsPassed;
        else if (gGame.secsPassed < localStorage.beginner) {
            localStorage.beginner = gGame.secsPassed;
        }

    }
    if (gLevel.SIZE === 8) {
        if (!localStorage.medium) localStorage.medium = gGame.secsPassed;
        else if (gGame.secsPassed < localStorage.medium) {
            localStorage.medium = gGame.secsPassed;
        }
    }
    if (gLevel.SIZE === 12) {
        if (!localStorage.expert) localStorage.expert = gGame.secsPassed;
        else if (gGame.secsPassed < localStorage.expert) {
            localStorage.expert = gGame.secsPassed;
        }
    }
    document.querySelector('.msg-user').innerText = 'You Won! click the smiley to restart';
    document.querySelector('.smiley').innerHTML = '<span id="sunglasses-smiley" onclick="initGame()"><img src="img/cool.png"></span>';
}


function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown || gBoard[i][j].isMine && !gBoard[i][j].isMarked) return false;
        }
    }
    return true;
}

function expandShown(board, elCell) {
    var row = +elCell.dataset.i;
    var col = +elCell.dataset.j;
    if (board[row][col].minesAroundCount > 0) return;
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === row && j === col) continue;
            if (board[i][j].isShown) continue;
            board[i][j].isShown = true;
            elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            expandShown(board, elCell);
        }
    }

}

function minesRevealed() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
            }
        }
    }
    renderBoard(gBoard);
}


