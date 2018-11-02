var boardSize = 10;
var numFields = boardSize * boardSize;
var numMines = 10;
var fieldSize = 25;
var died = false;
var fields = [];

$(() => {
    initBoard();
    plantMines();
    drawBoard();
    updateMsg();
});

function initBoard() {
    for (var i = 0; i < numFields; i++) {
        fields[i] = false;
    }
}

function plantMines() {
    var plantedMines = 0;
    while (plantedMines < numMines) {
        var n = Math.floor(Math.random() * numFields);
        if (!fields[n]) {
            fields[n] = true;
            plantedMines++;
        }
    }
}

function drawBoard() {
    var $board = $('#board');
    $board
        .css('width', boardSize * fieldSize)
        .css('height', boardSize * fieldSize);
    
    for (var i = 0; i < numFields; i++) {
        $div = $('<div>');
        $div.addClass('field')
            .addClass('fld' + i)
            .appendTo($board)
            .css('width', fieldSize)
            .css('height', fieldSize)
            .css('line-height', fieldSize + 'px')
            .mousedown(handleClick.bind($div[0], i))
            .contextmenu(handleRightClick.bind($div[0], i));
    }
}

function handleClick(n, ev) {
    if (ev.which !== 1) {
        return false;
    }
    if (died || checkWon()) {
        return false;
    }
    if (hasMine(n)) {
        var $fld = $(this);
        $fld.css('background-color', 'red');
        died = true;
        revealMines();
    } else {
        sweep(n);
    }
    if (checkWon()) {
        revealMines();
    }
    updateMsg();
    return false;
}

function handleRightClick(n) {
    if (died || checkWon() || fields[n] === null) {
        return false;
    }
    
    var $fld = $(this);
    if ($fld.text() == '?') {
        $fld.text('');
    } else {
        $fld.text('?').css('color', 'blue');
    }
    return false;
}

function hasMine(n) {
    return fields[n];
}

function numNearbyMines(n) {
    var row = Math.floor(n / boardSize);
    var column = n % boardSize;
    var startRow = row - 1;
    var startColumn = column - 1;
    var num = 0;
    
    for (var x = startRow; x < startRow + 3; x++) {
        for (var y = startColumn; y < startColumn + 3; y++) {
            if (x >= 0 && y >= 0 && x < boardSize && y < boardSize && !(x == row && y == column)) {
                if (hasMine(x * boardSize + y)) {
                    num++;
                }
            }
        }
    }
    
    return num;
}

function sweep(n) {
    var row = Math.floor(n / boardSize);
    var column = n % boardSize;
    var startRow = row - 1;
    var startColumn = column - 1;
    var num = 0;
    
    var num = numNearbyMines(n);
    if (num) {
        var $fld = $('.fld' + n);
        $fld.text(num).css('color', 'black').css('background-color', 'rgba(0, 255, 0, 0.2)');
        fields[n] = null;
        return;
    }
    
    for (var x = startRow; x < startRow + 3; x++) {
        for (var y = startColumn; y < startColumn + 3; y++) {
            if (x >= 0 && y >= 0 && x < boardSize && y < boardSize) {
                var n = x * boardSize + y;
                var $fld = $('.fld' + n);
                
                if (hasMine(n) || fields[n] === null) {
                    continue;
                }
                
                $fld.css('background-color', 'rgba(0, 255, 0, 0.2)');
                fields[n] = null;
                sweep(n);
                
            }
        }
    }
}

function checkWon() {
    return fields.filter(x => x !== null && x !== true).length == 0;
}

function revealMines() {
    for (var i = 0; i < numFields; i++) {
        if (fields[i]) {
            $('.fld' + i).css('background-color', died ? 'red' : 'green');
        }
    }
}

function updateMsg() {
    if (died) {
        $('#msg').text('You dead!').css('color', 'red');
        return;
    }
    if (checkWon()) {
        $('#msg').text('You win!').css('color', 'green');
    } else {
        $('#msg').text('Find ' + numMines + ' mines...');
    }
}
