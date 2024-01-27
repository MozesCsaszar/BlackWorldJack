function copyComputedStyle(css) {
    let n = {};
    for (let i in css) {
        n[i] = css[i];
    }
    return n;
}
//An element that contributes to a PatternMove
/*
    Pattern Element Language:
        Directions: u(up), r(right), d(down), l(left)
        's': start-point; used to past two PatternElements together into a PatternMove
        'f': fixed part of the pattern
        'c<dir>;': choosable part; inserts next element from PatternMove facing <dir> direction
                        -dir: 0,1,2,3 (up, righ, down, left)
        'sm': start move here
        'm': move (mandatory)
        'om': optional extension of move
        'em': end move here
        '.': separator between pattern characters
*/
var Direction;
(function (Direction) {
    Direction[Direction["up"] = 0] = "up";
    Direction[Direction["right"] = 1] = "right";
    Direction[Direction["down"] = 2] = "down";
    Direction[Direction["left"] = 3] = "left";
})(Direction || (Direction = {}));
function addDirections(d1, d2) {
    return d1 + d2 > 3 ? d1 + d2 - 4 : d1 + d2;
}
function subDirections(d1, d2) {
    return d1 - d2 < 0 ? d1 - d2 + 4 : d1 - d2;
}
class Connection {
    constructor(id, dir, row, col) {
        this.id = id;
        this.dir = dir;
        this.row = row;
        this.col = col;
    }
    getAbsoluteDir(parentDir) {
        return addDirections(parentDir, this.dir);
    }
}
class PatternElement {
    get pattern() {
        let nPattern = [];
        for (let i = 0; i < this._pattern.length; i++) {
            nPattern.push('');
            for (let j = 0; j < this._pattern[i].length; j++) {
                nPattern[i] += this._pattern[i][j];
                if (this._pattern[i][j] == 'c') {
                    j += 2;
                }
            }
        }
        return nPattern;
    }
    get basePattern() {
        return this._pattern;
    }
    get finalizedPattern() {
        let nPattern = [];
        for (let i = 0; i < this._pattern.length; i++) {
            nPattern.push('');
            for (let j = 0; j < this._pattern[i].length; j++) {
                if (this._pattern[i][j] == 'c') {
                    j += 2;
                    nPattern[i] += ' ';
                }
                else {
                    nPattern[i] += this._pattern[i][j];
                }
            }
        }
        return nPattern;
    }
    constructor(pattern, dir = Direction.up) {
        //each string is a row of the pattern
        this.startPoint = [];
        this.connections = [];
        this._pattern = pattern;
        this.makePatternRectangular();
        this.dir = dir;
        this.findStartPoint();
        this.findConnections();
    }
    //transforms (in-place) the pattern of the PatternElement to a rectangular matrix
    makePatternRectangular() {
        let longest = 0;
        this._pattern.forEach(e => { e.length > longest ? longest = e.length : undefined; });
        let len = [];
        for (let i = 0; i < this._pattern.length; i++) {
            len.push(0);
            for (let j = 0; j < this._pattern[i].length; j++) {
                len[i] += 1;
                if (this._pattern[i][j] == 'c') {
                    j += 2;
                }
            }
            if (len[i] > longest) {
                longest = len[i];
            }
        }
        for (let i = 0; i < this._pattern.length; i++) {
            let k = 0;
            while (len[i] + k < longest) {
                this._pattern[i] += ' ';
                k += 1;
            }
        }
    }
    rotateRight() {
        //in-place function
        let inter = [];
        for (let j = 0; j < this.pattern[0].length; j++) {
            inter.push([]);
            for (let i = 0; i < this.pattern.length; i++) {
                inter[j].push('');
            }
        }
        for (let i = 0; i < this._pattern.length; i++) {
            let connsFound = 0;
            for (let j = 0; j < this._pattern[i].length; j++) {
                let charToAdd = this._pattern[i][j];
                if (this._pattern[i][j] == 'c') {
                    charToAdd = this._pattern[i][j] + this._pattern[i][j + 1] + this._pattern[i][j + 2];
                    j += 2;
                    connsFound += 1;
                }
                inter[j - connsFound * 2][this._pattern.length - i - 1] = charToAdd;
            }
        }
        let inter2 = [];
        for (let i = 0; i < inter.length; i++) {
            inter2.push('');
            for (let j = 0; j < inter[i].length; j++) {
                inter2[i] += inter[i][j];
            }
        }
        this._pattern = inter2;
        this.dir = addDirections(1, this.dir);
    }
    findStartPoint() {
        this.pattern.forEach((s, i) => {
            for (let j = 0; j < s.length; j++) {
                if (s[j] == 's') {
                    this.startPoint = [i, j];
                    break;
                }
            }
        });
    }
    findConnections() {
        this.connections = [];
        this.basePattern.forEach((s, j) => {
            let nr_conns = 0;
            for (let k = 0; k < s.length; k++) {
                if (s[k] == 'c') {
                    this.connections.push(new Connection(this.connections.length, Number(s[k + 1]), j, k - nr_conns * 2));
                    k += 2;
                    nr_conns += 1;
                }
            }
        });
    }
    rotatePatternTo(new_dir) {
        //in-place function
        while (new_dir != this.dir) {
            this.rotateRight();
        }
        this.findStartPoint();
        this.findConnections();
    }
    rotatePatternBy(amount) {
        let finalDir = addDirections(amount, this.dir);
        this.rotatePatternTo(finalDir);
    }
    copy() {
        return new PatternElement(this.pattern, this.dir);
    }
}
//A pattern describing the Player's action that he is taking
class Pattern {
    constructor(elements, startingPattern = new PatternElement([' c0; ', 'c3;sc1;', ' c2; '])) {
        this.elements = [];
        //start at 1 because the starting move is already chosen for you
        this.currentElement = Pattern.defaultFirstElement;
        this.connectionsChosen = [];
        this.startingDirections = [];
        this.elements.push(startingPattern);
        this.startingDirections.push(startingPattern.dir);
        elements.forEach(e => { this.elements.push(e); this.connectionsChosen.push(undefined); this.startingDirections.push(e.dir); });
    }
    getCurrentElement() {
        return this.elements[this.currentElement];
    }
    getPreviousElement() {
        return this.elements[this.currentElement - 1];
    }
    getStart() {
        return this.getCurrentElement().startPoint;
    }
    placePattern() {
        if (this.currentElement + 1 < this.elements.length) {
            //this.elements.forEach(
            //  e => {e.findConnections(); e.findStartPoint()}
            //);
            this.currentElement += 1;
            this.chooseClosestConnection(Board.cursorPos);
            //let newConnPos = [this.getCurrentElement().connections[0].row, this.getCurrentElement().connections[0].col];
            //this.connectionsChosen[this.currentElement] = 0;
            //Board.patternPos[0] += newConnPos[0] - start[0];
            //Board.patternPos[1] += newConnPos[1] - start[1];
        }
        else {
            Board.canPlacePattern = true;
            Board.patternPos = [7, 7];
            this.reset();
        }
    }
    //find the closes connection to pos, a list of row, col coordinates, with patternPos being at center
    getClosestConnection(pos, center) {
        let conns = this.getPreviousElement().connections;
        let start;
        if (this.connectionsChosen[this.currentElement - 1] == undefined) {
            start = this.getPreviousElement().startPoint;
        }
        else {
            let oldConn = this.getPreviousElement().connections[this.connectionsChosen[this.currentElement - 1]];
            start = [oldConn.row, oldConn.col];
        }
        let dists = [];
        for (let i = 0; i < conns.length; i++) {
            let x = -pos[0] + conns[i].row - start[0] + center[0];
            let y = -pos[1] + conns[i].col - start[1] + center[1];
            dists.push(x * x + y * y);
        }
        let min = dists[0];
        let min_i = 0;
        for (let i = 1; i < dists.length; i++) {
            if (dists[i] < min) {
                min_i = i;
                min = dists[i];
            }
        }
        return conns[min_i];
    }
    chooseConnection(conn) {
        //if we would choose the same connection, do nothing
        if (conn == this.getPreviousElement().connections[this.connectionsChosen[this.currentElement - 1]]) {
            return;
        }
        let oldConnPos;
        if (this.connectionsChosen[this.currentElement - 1] == undefined) {
            oldConnPos = this.getPreviousElement().startPoint;
        }
        else {
            let oldConn = this.getPreviousElement().connections[this.connectionsChosen[this.currentElement - 1]];
            oldConnPos = [oldConn.row, oldConn.col];
        }
        let oldDir = Direction.up;
        if (this.getPreviousElement().connections[this.connectionsChosen[this.currentElement - 1]] != undefined) {
            oldDir = this.getPreviousElement().connections[this.connectionsChosen[this.currentElement - 1]].dir;
        }
        this.connectionsChosen[this.currentElement - 1] = conn.id;
        this.rotatePattern(conn.dir, oldDir);
        let connPos = [conn.row, conn.col];
        Board.patternPos[0] += connPos[0] - oldConnPos[0];
        Board.patternPos[1] += connPos[1] - oldConnPos[1];
    }
    chooseClosestConnection(pos) {
        this.chooseConnection(this.getClosestConnection(pos, Board.patternPos));
    }
    connectElements() {
        return this.getCurrentElement().pattern;
    }
    getCurrentPattern() {
        return this.connectElements();
    }
    rotatePattern(new_dir, old_dir = Direction.up) {
        if (this.currentElement == Pattern.defaultFirstElement) {
            let amount = subDirections(new_dir, this.elements[this.currentElement].dir);
            this.elements[this.currentElement].rotatePatternTo(new_dir);
            for (let i = this.currentElement + 1; i < this.elements.length; i++) {
                this.elements[i].rotatePatternBy(amount);
            }
        }
        else {
            let amount = subDirections(new_dir, old_dir);
            for (let i = this.currentElement; i < this.elements.length; i++) {
                this.elements[i].rotatePatternBy(amount);
            }
        }
    }
    reset() {
        this.currentElement = Pattern.defaultFirstElement;
        this.connectionsChosen = [];
        this.elements.forEach((e, i) => { this.connectionsChosen.push(undefined); e.rotatePatternTo(this.startingDirections[i]); });
    }
}
Pattern.defaultFirstElement = 1;
let pe1 = new PatternElement(['  c0;  ', 'c3;fffc1;', '  f', '  s',]);
let pe2 = new PatternElement([' f', ' s']);
let p1 = new Pattern([pe1, pe2]);
class Cell {
    constructor(div, row, col) {
        this.div = div;
        this.pos = [row, col];
        if (Cell.defStyle == undefined) {
            Cell.defStyle = copyComputedStyle(getComputedStyle(div));
        }
        this.setUpEventListeners();
        if (this.pos[0] == 7 && this.pos[1] == 7) {
            this.div.style.borderBlockColor = 'red';
        }
    }
    setUpEventListeners() {
        let c_obj = this;
        c_obj.div.addEventListener('mouseenter', e => c_obj.onMouseEnter(c_obj));
        c_obj.div.addEventListener('mouseleave', e => c_obj.onMouseLeave(c_obj));
        c_obj.div.addEventListener('click', e => c_obj.onClick(c_obj));
    }
    onMouseEnter(c_obj) {
        c_obj.div.style.borderColor = 'blue';
        Board.cursorPos = this.pos;
        Board.updatePattern(p1);
    }
    onMouseLeave(c_obj) {
        Board.cursorPos = undefined;
        c_obj.div.style.borderColor = Cell.defStyle.borderColor;
        if (c_obj.pos[0] == 7 && c_obj.pos[1] == 7) {
            this.div.style.borderBlockColor = 'red';
        }
    }
    onClick(c_obj) {
        Board.placePattern(p1);
    }
    display(str) {
        this.div.innerHTML = str;
    }
}
Cell.defStyle = undefined;
class Board {
    static updatePattern(pattern) {
        this.board.updatePattern(pattern);
    }
    static placePattern(pattern) {
        this.board.placePattern(pattern);
    }
    constructor(width, height) {
        this.boardGUI = [];
        this.width = width;
        this.height = height;
        for (let i = 0; i < this.height; i++) {
            this.boardGUI.push([]);
            for (let j = 0; j < this.width; j++) {
                let div = document.createElement('div');
                div.classList.add('cell');
                Board.div.appendChild(div);
                this.boardGUI[i].push(new Cell(div, i, j));
            }
        }
        let c_obj = this;
        Board.div.addEventListener('click', e => c_obj.onClick(c_obj));
        Board.board = this;
    }
    rotatePatternToMousePos(pattern) {
        pattern.chooseClosestConnection(Board.cursorPos);
        return pattern;
    }
    displayPattern(pattern) {
        let startPos = pattern.getStart();
        let offsetX = Board.patternPos[0] - startPos[0];
        let offsetY = Board.patternPos[1] - startPos[1];
        let sPattern = pattern.connectElements();
        this.clear();
        for (let i = 0; i < sPattern.length; i++) {
            for (let j = 0; j < sPattern[i].length; j++) {
                this.boardGUI[i + offsetX][j + offsetY].display(sPattern[i][j]);
            }
        }
    }
    updatePattern(pattern) {
        this.rotatePatternToMousePos(pattern);
        this.displayPattern(pattern);
    }
    placePattern(pattern) {
        pattern.placePattern();
        this.displayPattern(pattern);
    }
    onClick(c_obj) {
        c_obj.displayPattern(p1);
    }
    clear() {
        for (let i = 0; i < this.boardGUI.length; i++) {
            for (let j = 0; j < this.boardGUI[i].length; j++) {
                this.boardGUI[i][j].display('');
            }
        }
    }
}
Board.cursorPos = undefined;
Board.patternPos = [7, 7];
Board.div = document.getElementById('Board');
Board.canPlacePattern = true;
//Initializations
let b = new Board(15, 15);
//# sourceMappingURL=isolated.js.map