
const BOMB = '💣';
const FLAG = '🚩';
const HINT = 3;
var gBoard;

var gLevel = { SIZE: 4, MINES: 2 };

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };

var gStopwatchInterval;
//prevets the default menu from showing
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();

}, false);

//initializing the game
function initGame() {
    gGame.isOn = true;
    document.querySelector('.modal').classList.add('hide');
    document.querySelector('.stopwatch span').innerText = 0;
    document.querySelector('.hints').innerHTML = '<span class="hint" onclick="useHint()">1</span><span class="hint" onclick="useHint()">1</span>' +
        '<span class="hint" onclick="useHint()">1</span>';

    gBoard = buildBoard();
    renderBoard(gBoard);
    console.table(gBoard);
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
function revealCell(elCell) {
    var i = elCell.dataset.i;
    var j = elCell.dataset.j;
    revealNgsAndSelf(i, j);

    function revealNgsAndSelf(i, j) {
        var willDisappear = [];
        var location = {};
        for (var i = row - 1; i <= row + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = col - 1; j <= col + 1; j++) {
                if (j < 0 || j >= board[0].length) continue;
                if (!board[i][j].isShown) {
                    board[i][j].isShown = true;
                    location = { row: i, col: j }
                    willDisappear.push(location);
                }
            }
        }
        renderBoard(gBoard);
    }

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

            var className = 'cell cell' + i + '-' + j;
            var cell = '';

            if (board[i][j].isShown) {
                className += ' shown';
                if (board[i][j].isMine) cell = BOMB;
                else cell = board[i][j].minesAroundCount;
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
    var i = elCell.dataset.i;
    var j = elCell.dataset.j;
    if (gBoard[i][j].isMarked) gBoard[i][j].isMarked = false;
    else gBoard[i][j].isMarked = true;
    renderBoard(gBoard);
}

function cellClicked(elCell) {
    var i = elCell.dataset.i;
    var j = elCell.dataset.j;
    if (gBoard[i][j].isShown || !gGame.isOn || gBoard[i][j].isMarked) {
        return;
    }
    if (isFirstClick()) {
        var start = Date.now();
        gStopwatchInterval = setInterval(stopwatch, 1000, start);
        genRndMines(gBoard, gLevel.MINES, i, j);
        setMinesNegsCount(gBoard);
    }
    gBoard[i][j].isShown = true;
    if (gBoard[i][j].isMine) gameLost();
    if (checkGameOver()) gameWon();
    renderBoard(gBoard);

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function stopwatch(start) {
    var currTime = Date.now();
    var seconds = ((currTime - start) / 1000).toString();
    var secIndex = seconds.indexOf('.');
    var onlySeconds = seconds.substring(0, secIndex);
    document.querySelector('.stopwatch span').innerText = onlySeconds;
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
        console.log('clicked element '+i,j)
        console.log(rndRow,rndCol);
        var cell = board[rndRow][rndCol];
        while (cell.isMine || (rndRow <= i + 1 && rndRow >= i - 1 && rndCol <= j + 1 && rndCol >= j - 1)) {
            rndRow = getRandomInt(0, board.length);
            rndCol = getRandomInt(0, board[0].length);
            cell = board[rndRow][rndCol];
            console.log('if the cell is mined '+cell.isMine)
            console.log(rndRow,rndCol);
        }
        cell.isMine = true;
    }
}

function gameLost() {
    gGame.isOn = false;
    clearInterval(gStopwatchInterval);
    minesRevealed();
    document.querySelector('.modal').innerText = 'You Lost! click to restart';
    document.querySelector('.modal').classList.remove('hide');
}

function gameWon() {
    gGame.isOn = false;
    clearInterval(gStopwatchInterval);
    document.querySelector('.modal').innerText = 'You Won! click to restart';
    document.querySelector('.modal').classList.remove('hide');
}


function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown || gBoard[i][j].isMine && !gBoard[i][j].isMarked) return false;
        }
    }
    return true;
}

function expandShown(board, elCell, i, j) {

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


