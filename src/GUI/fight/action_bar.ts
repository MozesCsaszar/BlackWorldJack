namespace ActionBarGUIs {
  class AreaGridCellGUI {
    static readonly _divClass: string = ".cell";
    static get classFullPath(): string {
      return AreaGridRowGUI.classFullPath + ">" + this._divClass;
    }

    private _div: HTMLElement;
    private _row: number;
    private _col: number;
    private _board: FightBoard;
    constructor(div: HTMLElement, row: number, col: number) {
      this._div = div;
      this._row = row;
      this._col = col;
      this.setUpEventListeners();
    }
    private setUpEventListeners() {
      let c_obj: AreaGridCellGUI = this;
      this._div.addEventListener("mouseenter", (e: MouseEvent) =>
        c_obj.onMouseEnter(e, c_obj)
      );
      this._div.addEventListener("mouseleave", (e: MouseEvent) =>
        c_obj.onMouseLeave(e, c_obj)
      );
      this._div.addEventListener("mousedown", (e: MouseEvent) => {
        c_obj.onMouseClick(e, c_obj);
      });
    }
    onMouseEnter(e: MouseEvent, c_obj: AreaGridCellGUI) {
      if (!DragAPI.dragging) {
        c_obj._div.style.borderColor = "rgb(0,0,255)";
        ActionBarAreaGridGUI.cursorPos = new Pos(this._col, this._row);
        ActionBarAreaGridGUI._self.updateActionPattern();
      }
    }
    onMouseLeave(e: MouseEvent, c_obj: AreaGridCellGUI) {
      if (!DragAPI.dragging) {
        c_obj._div.style.borderColor = "green";
      }
    }
    onMouseClick(e: MouseEvent, c_obj: AreaGridCellGUI) {
      if (e.button == 0) {
        ActionBarAreaGridGUI._self.actionPatternNext();
      } else if (e.button == 2) {
        ActionBarAreaGridGUI._self.actionPatternPrev();
      }
    }
    setUpFightCell(board: FightBoard) {
      this._board = board;
      let innerRepr: string = "";

      if (this._board.enemyLayer[this._row][this._col] != undefined) {
        innerRepr =
          "<div>" +
          this._board.enemyLayer[this._row][this._col].symbol +
          "</div>";
      } else if (
        this._board.playerPos.y == this._row &&
        this._board.playerPos.x == this._col
      ) {
        innerRepr = "<div>" + "P" + "</div>";
      }
      this._div.innerHTML =
        this._board.baseLayer[this._row][this._col].repr(innerRepr);
    }
    /**
     * Reset the looks of the cell to it's original
     */
    reset() {
      this._div.style.borderColor = "green";
    }

    setBacgroundColor(color: string) {
      this._div.style.borderColor = color;
    }
  }

  class AreaGridRowGUI {
    static readonly _divClass: string = ".row";
    private static readonly _rowOffset: number = 28;
    static get classFullPath(): string {
      return ActionBarAreaGridGUI.fullPath + ">" + this._divClass;
    }

    private _div: HTMLElement;
    private _cellGUIs: AreaGridCellGUI[] = [];
    get cellGUIs() {
      return this._cellGUIs;
    }
    constructor(div: HTMLElement, nr: number, offsetInd: number) {
      this._div = div;
      this._div.style.left =
        (offsetInd * AreaGridRowGUI._rowOffset).toString() + "px";
      document
        .querySelectorAll(
          AreaGridRowGUI.classFullPath +
            "._" +
            nr +
            ">" +
            AreaGridCellGUI._divClass
        )
        .forEach((e, i) =>
          this._cellGUIs.push(new AreaGridCellGUI(e as HTMLElement, nr, i))
        );
    }
    setUpFightCell(col: number, board: FightBoard) {
      this._cellGUIs[col].setUpFightCell(board);
    }
    /**
     * Reset row of cells to original looks
     */
    reset() {
      this._cellGUIs.forEach((cellGUI) => cellGUI.reset());
    }
  }

  export class ActionBarAreaGridGUI {
    static readonly _divID: string = "FSActionBarAreaGrid";
    static _self: ActionBarAreaGridGUI;
    private static _nrInstances: number = 0;
    static cursorPos: Pos = new Pos(0, 0);

    static get fullPath(): string {
      return ActionBarGUI.fullPath + ">#" + this._divID;
    }

    private _div: HTMLElement;
    private _rowGUIs: AreaGridRowGUI[] = [];
    private _fightInstance: FightInstance = undefined;
    private _playerAction: Action.PlayerAction = undefined;
    constructor() {
      if (ActionBarAreaGridGUI._nrInstances > 0) {
        throw "ActionBarAreaGridGUI already has an instance running!";
      }

      ActionBarAreaGridGUI._nrInstances += 1;
      ActionBarAreaGridGUI._self = this;

      this._div = document.getElementById(ActionBarAreaGridGUI._divID);
      document
        .querySelectorAll(AreaGridRowGUI.classFullPath)
        .forEach((e, i, l) => {
          this._rowGUIs.push(
            new AreaGridRowGUI(e as HTMLElement, i, l.length - i - 1)
          );
        });
    }
    setUpFightBoard(fightInstance: FightInstance) {
      fightInstance.fightBoard.baseLayer.forEach((e, row) =>
        e.forEach((tile, col) =>
          this._rowGUIs[row].setUpFightCell(col, fightInstance.fightBoard)
        )
      );
      this._fightInstance = fightInstance;
    }
    /**
     * Reset board to original looks
     */
    reset(): void {
      this._rowGUIs.forEach((rowGUI) => rowGUI.reset());
    }

    setUpActionPattern(actionName: string): void {
      this._playerAction = this._fightInstance.player.actions.find(
        (action) => action.name == actionName
      );
      this.displayActionPattern();
    }

    displayActionPattern(): void {
      if (this._playerAction != undefined) {
        this.reset();

        this._playerAction.pattern.pattern
          .getCurrentOccupiedSpaces(this._fightInstance.playerTempPos)
          .forEach((element) => {
            this._rowGUIs[element.pos.y].cellGUIs[
              element.pos.x
            ].setBacgroundColor(
              this._playerAction.pattern.actions.get(element.annotation).color
            );
          });
      }
    }
    updateActionPattern(): void {
      if (this._playerAction != undefined) {
        this._playerAction.pattern.chooseClosesConnection(
          ActionBarAreaGridGUI.cursorPos.sub(this._fightInstance.playerTempPos)
        );
        this.displayActionPattern();
      }
    }
    tearDownActionPattern(): void {
      this._playerAction = undefined;
      this.reset();
    }
    // TODO: Implement this
    finalizeActionPattern(): void {
      this._playerAction = undefined;
    }
    actionPatternNext() {
      if (this._playerAction != undefined) {
        if (
          !this._playerAction.pattern.nextStep(
            this._fightInstance.playerTempPos
          )
        ) {
          this.finalizeActionPattern();
        }
      }
    }
    actionPatternPrev() {
      if (this._playerAction != undefined) {
        if (
          !this._playerAction.pattern.prevStep(
            this._fightInstance.playerTempPos
          )
        ) {
          this.tearDownActionPattern();
        }
      }
    }
  }

  export class ActionListElementGUI {
    static readonly _elementClass: string = ".action_list_element";
    static readonly _dragObjType: string = "action";
    static readonly _dragProperties: string[] = [
      "width",
      "height",
      "border",
      "backgroundColor",
      "display",
    ];
    private _action: Action.PlayerAction;
    private _div: HTMLElement;
    get action(): Action.PlayerAction {
      return this._action;
    }
    set action(a: Action.PlayerAction) {
      this._action = a;
      this.display();
    }
    constructor(div: HTMLElement) {
      this._div = div;
      this.setUpEventListeners();
    }
    private setUpEventListeners() {
      let c_obj: ActionListElementGUI = this;
      this._div.addEventListener("mousedown", (e: MouseEvent) =>
        c_obj.onMouseDown(e, c_obj)
      );
    }
    display(): void {
      this._div.innerHTML = this.repr();
    }
    repr(): string {
      return this._action != null ? this._action.name : "";
    }
    setHeight(height: number) {
      this._div.style.height =
        height -
        2 * Number(getComputedStyle(this._div).borderWidth.slice(0, -2)) +
        "px";
    }
    onMouseDown(e: MouseEvent, c_obj: ActionListElementGUI): void {
      if (!DragAPI.dragging && c_obj.action != null) {
        let left: number = c_obj._div.getBoundingClientRect().left - 8;
        let top: number = c_obj._div.getBoundingClientRect().top - 52;
        c_obj.setUpDragObject(left, top);
        DragAPI.startDrag(
          ActionListElementGUI._dragObjType,
          c_obj.action.save(),
          e,
          true
        );
      }
    }
    setUpDragObject(left: number, top: number): void {
      let styleSheet = getComputedStyle(this._div);
      let styleNeeded = new Map<string, string>();
      ActionListElementGUI._dragProperties.forEach((e) => {
        styleNeeded.set(DragAPI.dragPropertyToCSS(e), styleSheet[e]);
      });
      styleNeeded.set("left", left + "px");
      styleNeeded.set("top", top + "px");
      DragAPI.setUpDragObject(styleNeeded, this.createDragObjectInnerHTML());
    }
    createDragObjectInnerHTML(): string {
      return this._action.name;
    }
  }

  class ActionListGUI {
    private _listElements: ActionListElementGUI[] = [];
    private _elements: Action.PlayerAction[] = [];
    private _currentPage: number;
    private _div: HTMLElement;

    constructor(div: HTMLElement, elementsPerPage: number) {
      this._div = div;
      this.elementsPerPage = elementsPerPage;
      this._currentPage = 0;
    }
    set elementsPerPage(nr: number) {
      if (nr != this._listElements.length) {
        while (this._listElements.length < nr) {
          let newDiv: HTMLElement = document.createElement(
            "div"
          ) as HTMLElement;
          newDiv.classList.add(ActionListElementGUI._elementClass.slice(1));
          this._div.appendChild(newDiv);
          this._listElements.push(new ActionListElementGUI(newDiv));
        }
        while (this._listElements.length > nr) {
          this._listElements.pop();
        }
        let height: number = this._div.clientHeight / this._listElements.length;
        this._listElements.forEach((e) => e.setHeight(height));
        this.update();
      }
    }
    get elementsPerPage() {
      return this._listElements.length;
    }
    get currentPage() {
      return this._currentPage;
    }
    get nrPages() {
      return Math.ceil(this._elements.length / this.elementsPerPage);
    }
    set elements(actions: Action.PlayerAction[]) {
      this._elements = actions;
    }
    nextPage(): void {
      if (this.currentPage < this.nrPages) {
        this._currentPage++;
      }
    }
    getElementOnCurrentPage(i: number): Action.PlayerAction {
      let ind: number = this._currentPage * this._listElements.length + i;
      if (i > this.elementsPerPage || ind >= this._elements.length) {
        throw "ListGUI ERROR: Element requested not in list!";
      }
      return this._elements[ind];
    }
    addToEnd(elem: Action.PlayerAction): void {
      this._elements.push(elem);
    }
    update() {
      let offsetInd = this._currentPage * this.elementsPerPage;
      this._listElements.forEach((e, i) => {
        i + offsetInd < this._elements.length
          ? (e.action = this._elements[i + offsetInd])
          : (e.action = null);
      });
    }
  }

  export class ActionBarGUI {
    static readonly _divID: string = "FightScreenActionBar";
    static _self: ActionBarGUI;
    private static readonly _nrElementsPerList: number = 10;
    private static readonly _spellListID: string = "FSActionBarSpellActions";
    private static readonly _otherListID: string = "FSActionBarOtherActions";
    private static _nrInstances: number = 0;

    static get fullPath(): string {
      return FightScreenGUI.fullPath + ">#" + this._divID;
    }

    private _div: HTMLElement;
    private _spellActionList: ActionListGUI;
    private _otherActionList: ActionListGUI;
    private _areaGridGUI: ActionBarAreaGridGUI;

    constructor() {
      if (ActionBarGUI._nrInstances > 0) {
        throw "InfoBarGUI already has an instance running!";
      }
      ActionBarGUI._nrInstances += 1;
      ActionBarGUI._self = this;
      this._div = document.getElementById(ActionBarGUI._divID);

      this._spellActionList = new ActionListGUI(
        document.getElementById(ActionBarGUI._spellListID) as HTMLElement,
        ActionBarGUI._nrElementsPerList
      );
      this._areaGridGUI = new ActionBarAreaGridGUI();
      this._otherActionList = new ActionListGUI(
        document.getElementById(ActionBarGUI._otherListID) as HTMLElement,
        ActionBarGUI._nrElementsPerList
      );
      this._otherActionList.elements = Action.player_actions;

      this.update();
    }
    update(): void {
      this._spellActionList.update();
      this._otherActionList.update();
    }
    setUpFightBoard(fightInstance: FightInstance): void {
      this._areaGridGUI.setUpFightBoard(fightInstance);
    }
  }
}