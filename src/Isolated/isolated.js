// function copyComputedStyle(css: CSSStyleDeclaration): {} {
//   let n = {};
//   for (let i in css) {
//     n[i] = css[i];
//   }
//   return n;
// }
// class Cell {
//   static defStyle = undefined;
//   pos: Pos;
//   div: HTMLElement;
//   constructor(div: HTMLElement, row: number, col: number) {
//     this.div = div;
//     this.pos = new Pos(col, row);
//     if (Cell.defStyle == undefined) {
//       Cell.defStyle = copyComputedStyle(getComputedStyle(div));
//     }
//     this.setUpEventListeners();
//     if (this.pos[0] == 7 && this.pos[1] == 7) {
//       this.div.style.borderBlockColor = "red";
//     }
//   }
//   setUpEventListeners() {
//     let c_obj: Cell = this;
//     this.div.addEventListener("mouseenter", (e) => c_obj.onMouseEnter(c_obj));
//     this.div.addEventListener("mouseleave", (e) => c_obj.onMouseLeave(c_obj));
//     this.div.addEventListener("click", (e) => c_obj.onClick(c_obj));
//     this.div.addEventListener("contextmenu", (e) =>
//       c_obj.onRightClick(e, c_obj)
//     );
//   }
//   onMouseEnter(c_obj: Cell) {
//     c_obj.div.style.borderColor = "blue";
//     Board.cursorPos = new Pos(2 * this.pos.x, Board.board.width - 1).sub(
//       this.pos
//     );
//     Board.updatePattern(p1);
//   }
//   onMouseLeave(c_obj: Cell) {
//     Board.cursorPos = undefined;
//     c_obj.div.style.borderColor = Cell.defStyle.borderColor;
//     if (c_obj.pos[0] == 7 && c_obj.pos[1] == 7) {
//       this.div.style.borderBlockColor = "red";
//     }
//   }
//   onRightClick(e: MouseEvent, c_obj: Cell) {
//     e.preventDefault();
//     Board.removePattern(p1);
//   }
//   onClick(c_obj: Cell) {
//     Board.placePattern(p1);
//   }
//   display(str: string) {
//     this.div.innerHTML = str;
//   }
// }
// class Board {
//   static cursorPos: Pos = undefined;
//   static patternPos: Pos = new Pos(7, 7);
//   static div: HTMLElement = document.getElementById("Board") as HTMLElement;
//   static canPlacePattern: boolean = true;
//   static board: Board;
//   static updatePattern(pattern: ActionPattern) {
//     this.board.updatePattern(pattern);
//   }
//   static placePattern(pattern: ActionPattern) {
//     this.board.placePattern(pattern);
//   }
//   static removePattern(pattern: ActionPattern) {
//     this.board.removePattern(pattern);
//   }
//   boardGUI: Cell[][] = [];
//   width: number;
//   height: number;
//   constructor(width: number, height: number) {
//     this.width = width;
//     this.height = height;
//     for (let i = 0; i < this.height; i++) {
//       this.boardGUI.push([]);
//       for (let j = 0; j < this.width; j++) {
//         let div: HTMLElement = document.createElement("div") as HTMLElement;
//         div.classList.add("cell");
//         Board.div.appendChild(div);
//         this.boardGUI[i].push(new Cell(div, i, j));
//       }
//     }
//     let c_obj = this;
//     Board.div.addEventListener("click", (e) => c_obj.onClick(c_obj));
//     Board.board = this;
//   }
//   displayPattern(pattern: ActionPattern): void {
//     this.clear();
//     pattern.getCurrentOccupiedSpaces(Board.patternPos).forEach((element) => {
//       this.boardGUI[this.width - element.pos.y - 1][
//         element.pos.x
//       ].div.style.backgroundColor = pattern.actions.get(
//         element.annotation
//       ).color;
//     });
//   }
//   updatePattern(pattern: ActionPattern): void {
//     // substract patternPos to normalize starting point of calculation to 0,0 in pattern space
//     pattern.chooseClosesConnection(Board.cursorPos.sub(Board.patternPos));
//     this.displayPattern(pattern);
//   }
//   placePattern(pattern: ActionPattern): void {
//     pattern.nextStep(Board.cursorPos.sub(Board.patternPos));
//     this.displayPattern(pattern);
//   }
//   removePattern(pattern: ActionPattern): void {
//     pattern.prevStep(Board.cursorPos.sub(Board.patternPos));
//     this.displayPattern(pattern);
//   }
//   onClick(c_obj: Board) {
//     c_obj.displayPattern(p1);
//   }
//   clear(): void {
//     for (let i = 0; i < this.boardGUI.length; i++) {
//       for (let j = 0; j < this.boardGUI[i].length; j++) {
//         this.boardGUI[i][j].div.style.backgroundColor = "000000";
//       }
//     }
//   }
// }
// //Initializations
// let b: Board = new Board(15, 15);
//# sourceMappingURL=isolated.js.map