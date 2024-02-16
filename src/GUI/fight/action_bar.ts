namespace ActionBarGUIs {
  abstract class AEntityTileGUI {
    protected _healthBar: JQuery<HTMLElement>;
    protected _staminaBar: JQuery<HTMLElement>;
    protected _manaBar: JQuery<HTMLElement>;
    protected _nameText: JQuery<HTMLElement>;
    protected _modifiersColumn: JQuery<HTMLElement>;
    protected _statsText: JQuery<HTMLElement>;

    protected _div: JQuery<HTMLElement>;

    protected _entity: AEntity;

    display(): void {
      if (this._entity == undefined) {
        this._div.hide();
      } else {
        this.update();
        if (this._div.is(":hidden")) {
          this._div.show();
        }
      }
    }
    protected _getBarFillPercent(current: number, max: number) {
      return max != 0 ? ((current / max) * 100).toFixed(1) + "%" : 0;
    }
    updateInfo(): void {
      console.log(this._entity.baseStats, this._entity.currentStats);
      // update entity bars
      this._healthBar.css(
        "width",
        this._getBarFillPercent(
          this._entity.currentStats.health,
          this._entity.baseStats.health
        )
      );
      this._staminaBar.css(
        "width",
        this._getBarFillPercent(
          this._entity.currentStats.stamina,
          this._entity.baseStats.stamina
        )
      );
      this._manaBar.css(
        "width",
        this._getBarFillPercent(
          this._entity.currentStats.mana,
          this._entity.baseStats.mana
        )
      );
      this._statsText.html(this._entity.currentStats.getHTMLStats());
    }
    abstract setUpInfo(): void;
    abstract updateNextMove(): void;
    update(): void {
      this.updateNextMove();
      this.updateInfo();
    }
    setUpForFight(entity: AEntity): void {
      this.setUpInfo();
    }
  }
  class EnemyTileGUI extends AEntityTileGUI {
    setUpInfo(): void {
      this._nameText.text(this._entity.name);
    }
    protected _nextMoveSymbols: JQuery<HTMLElement>;
    protected _nextMoveCells: JQuery<HTMLElement>[][] = [];
    protected _rewardText: JQuery<HTMLElement>;

    protected _entity: Enemy.EnemyWithLevel;

    constructor(parent: JQuery<HTMLElement>) {
      super();
      this._div = JQueryUtils.createDiv({
        htmlClass: "enemy-tile",
        parent: parent,
      });
      let top: JQuery<HTMLElement> = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-top",
        parent: this._div,
      });
      this._nameText = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-name",
        parent: top,
      });
      // rewards
      this._rewardText = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-rewards",
        parent: top,
      });
      let bottom = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-bottom",
        parent: this._div,
      });
      let left = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-bottom-left",
        parent: bottom,
      });
      this._modifiersColumn = JQueryUtils.createDiv({
        htmlClass: "entity-tile-modifiers",
        parent: bottom,
      });
      this._statsText = JQueryUtils.createDiv({
        htmlClass: "entity-tile-stats",
        parent: left,
      });
      bottom = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-bottom-left-bottom",
        parent: left,
      });
      // status bars (health, stamina, mana)
      left = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-status-bars",
        parent: bottom,
      });
      let bar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-hp",
        parent: left,
      });
      this._healthBar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-hp-bar",
        parent: bar,
      });
      bar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-sta",
        parent: left,
      });
      this._staminaBar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-sta-bar",
        parent: bar,
      });
      bar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-mp",
        parent: left,
      });
      this._manaBar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-mp-bar",
        parent: bar,
      });
      // next move cell
      let right = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-next-move-cell",
        parent: bottom,
      });
      this._nextMoveSymbols = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-next-move-symbols",
        parent: right,
      });
      bottom = JQueryUtils.createDiv({
        htmlClass: "enemy-tile-next-move-cells",
        parent: right,
      });
      for (let i = 0; i < 3; i++) {
        let row = JQueryUtils.createDiv({
          htmlClass: `enemy-tile-next-move-row _${i}`,
          parent: bottom,
        });
        this._nextMoveCells.push([]);
        for (let j = 0; j < 3; j++) {
          this._nextMoveCells[i].push(
            JQueryUtils.createDiv({
              htmlClass: `enemy-tile-next-move-row-cell _${j}`,
              parent: row,
            })
          );
        }
      }
    }

    updateExceptNextMove(): void {
      throw new Error("Method not implemented.");
    }
    updateNextMove(): void {
      throw new Error("Method not implemented.");
    }
    setUpForFight(entity: Enemy.EnemyWithLevel): void {
      this._entity = entity;
    }
  }
  class PlayerTileGUI extends AEntityTileGUI {
    setUpInfo(): void {
      this._nameText.text("Player");
    }
    protected _entity: FightPlayer;
    constructor(parent: JQuery<HTMLElement>) {
      super();
      this._div = JQueryUtils.createDiv({
        htmlClass: "player-tile",
        parent: parent,
      });
      let left: JQuery<HTMLElement> = JQueryUtils.createDiv({
        htmlClass: "player-tile-left",
        parent: this._div,
      });
      this._modifiersColumn = JQueryUtils.createDiv({
        htmlClass: "entity-tile-modifiers",
        parent: this._div,
      });
      this._nameText = JQueryUtils.createDiv({
        htmlClass: "player-tile-name",
        parent: left,
      });

      let bottom = JQueryUtils.createDiv({
        htmlClass: "player-tile-left-bottom",
        parent: left,
      });
      // stats
      this._statsText = JQueryUtils.createDiv({
        htmlClass: "entity-tile-stats",
        parent: bottom,
      });
      left = JQueryUtils.createDiv({
        htmlClass: "player-tile-status-bars",
        parent: bottom,
      });
      let bar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-hp",
        parent: left,
      });
      this._healthBar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-hp-bar",
        parent: bar,
      });
      bar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-sta",
        parent: left,
      });
      this._staminaBar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-sta-bar",
        parent: bar,
      });
      bar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-mp",
        parent: left,
      });
      this._manaBar = JQueryUtils.createDiv({
        htmlClass: "entity-tile-mp-bar",
        parent: bar,
      });
    }
    // TODO: Implement this
    updateExceptNextMove(): void {}
    updateNextMove(): void {}
    setUpForFight(entity: FightPlayer): void {
      this._entity = entity;
      super.setUpForFight(entity);
      this.display();
    }
  }

  class AAreaGridCellGUI {
    static readonly _divClass: string = "tile";
    static get classFullPath(): string {
      return AreaGridRowGUI.classFullPath + ">" + this._divClass;
    }

    protected _div: JQuery<HTMLElement>;
    protected _entityTileGUI: AEntityTileGUI;
    protected _row: number;
    protected _col: number;
    protected _tile: ATile;

    get tile(): ATile {
      return this._tile;
    }

    constructor(parent: JQuery<HTMLElement>, row: number, col: number) {
      this._div = JQueryUtils.createDiv({
        htmlClass: AAreaGridCellGUI._divClass,
        parent: parent,
      });

      this._row = row;
      this._col = col;
      this.setUpEventListeners();
    }
    protected setUpEventListeners() {
      this._div.on("mouseenter", (e) => this.onMouseEnter());
      this._div.on("mouseleave", (e) => this.onMouseLeave());
    }
    onMouseEnter() {
      if (!DragAPI.dragging) {
        this._div.css("border-color", "rgb(0,0,255)");
        ActionBarAreaGridGUI.cursorPos = new Pos(this._col, this._row);
      }
    }
    onMouseLeave() {
      if (!DragAPI.dragging) {
        this._div.css("border-color", "green");
      }
    }
    setUpFightCell(board: FightBoard) {
      this._tile = board.tiles[this._row][this._col];
      this._entityTileGUI.setUpForFight(this._tile.entity?.entity);
      this.display();
    }
    display() {
      // style the tile
      this._tile.backgroundStye.applyStyle(this._div);
      this._entityTileGUI.display();
    }
    enter(entity: AEntity) {
      // add entity to tile
      this._tile.enter(entity);
      // change entity position
      entity.pos = new Pos(this._col, this._row);
      // display changes
      this.display();
    }
    exit(entity: AEntity) {
      // remove entity from tile
      this._tile.exit(entity);
      // display changes
      this.display();
    }
    applyToExcept(effect: IEntityEffect, entity: AEntity) {
      this._tile.applyToExcept(effect, entity);
      // display changes
      this.display();
    }

    /**
     * Reset the looks of the cell to it's original
     */
    reset() {
      this._div.css("border-color", "green");
    }

    setBacgroundColor(color: string) {
      this._div.css("border-color", color);
    }
  }

  class AreaGridEnemyCellGUI extends AAreaGridCellGUI {
    constructor(parent: JQuery<HTMLElement>, row: number, col: number) {
      super(parent, row, col);
      this._entityTileGUI = new EnemyTileGUI(this._div);
    }
  }

  class AreaGridPlayerCellGUI extends AAreaGridCellGUI {
    constructor(parent: JQuery<HTMLElement>, row: number, col: number) {
      super(parent, row, col);
      this._entityTileGUI = new PlayerTileGUI(this._div);
    }
  }

  class AreaGridRowGUI {
    static readonly _divClass: string = "row";
    static get classFullPath(): string {
      return ActionBarAreaGridGUI.fullPath + ">" + this._divClass;
    }

    private _div: JQuery<HTMLElement>;
    private _cellGUIs: AAreaGridCellGUI[] = [];
    private _row: number;
    get cellGUIs() {
      return this._cellGUIs;
    }
    constructor(parent: JQuery<HTMLElement>, row: number) {
      this._row = row;
      this._div = JQueryUtils.createDiv({
        htmlClass: `${AreaGridRowGUI._divClass} _${row}`,
        parent: parent,
      });

      for (let i = 0; i < ActionBarAreaGridGUI.cols; i++) {
        if (row != 2)
          this._cellGUIs.push(
            new AreaGridEnemyCellGUI(this._div, this._row, i)
          );
        else
          this._cellGUIs.push(
            new AreaGridPlayerCellGUI(this._div, this._row, i)
          );
      }
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
    static readonly divID: string = "FSActionBarAreaGrid";
    static self: ActionBarAreaGridGUI;
    static readonly rows: number = 3;
    static readonly cols: number = 3;
    private static _nrInstances: number = 0;
    static cursorPos: Pos = new Pos(0, 0);

    static get fullPath(): string {
      return ActionBarGUI.fullPath + ">#" + this.divID;
    }

    private _div: JQuery<HTMLElement>;
    private _rowGUIs: AreaGridRowGUI[] = [];
    private _fightInstance: FightInstance = undefined;
    private _playerAction: Action.Action = undefined;
    constructor(parent: JQuery<HTMLElement>) {
      if (ActionBarAreaGridGUI._nrInstances > 0) {
        throw "ActionBarAreaGridGUI already has an instance running!";
      }

      ActionBarAreaGridGUI._nrInstances += 1;
      ActionBarAreaGridGUI.self = this;

      this._div = JQueryUtils.createDiv({
        htmlID: ActionBarAreaGridGUI.divID,
        parent: parent,
      });

      for (let i = 0; i < ActionBarAreaGridGUI.rows; i++) {
        this._rowGUIs.push(new AreaGridRowGUI(this._div, i));
      }
      document
        .querySelectorAll(AreaGridRowGUI.classFullPath)
        .forEach((e, i, l) => {
          this._rowGUIs.push(new AreaGridRowGUI(this._div, i));
        });
    }
    setUpFightBoard(fightInstance: FightInstance) {
      fightInstance.fightBoard.tiles.forEach((e, row) =>
        e.forEach((tile, col) =>
          this._rowGUIs[row].setUpFightCell(col, fightInstance.fightBoard)
        )
      );
      this._fightInstance = fightInstance;
    }
    endPlayerTurn(): void {
      let playerPos = this._fightInstance.playerPos;
      this._rowGUIs[playerPos.row].cellGUIs[playerPos.col].tile.stay(
        this._fightInstance.player.player
      );
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
          .getCurrentOccupiedSpaces(this._fightInstance.playerPos)
          .forEach((element) => {
            this._rowGUIs[element.pos.row].cellGUIs[
              element.pos.col
            ].setBacgroundColor(
              this._playerAction.pattern.actions.get(element.annotation).color
            );
          });
      }
    }
    tearDownActionPattern(): void {
      this._playerAction = undefined;
      this.reset();
    }
    finalizeActionPattern(): void {
      let player = this._fightInstance.player.player;
      let pattern = this._playerAction.pattern;
      pattern.getCurrentOccupiedSpaces(player.pos).forEach((annPos) => {
        let action = pattern.actions.get(annPos.annotation);
        // if we need to move, move there
        if (action instanceof Action.AMoveAction) {
          // exit old tile
          this._rowGUIs[player.pos.row].cellGUIs[player.pos.col].exit(player);
          // enter new tile
          this._rowGUIs[annPos.pos.row].cellGUIs[annPos.pos.col].enter(player);
        } else if (action instanceof Action.AAttackAction) {
          this._rowGUIs[annPos.pos.row].cellGUIs[annPos.pos.col].applyToExcept(
            action.effect,
            player
          );
        } else {
        }
        // update info display after every action
        InfoBarGUIs.InfoBarGUI.self.update();
      });

      this.reset();
      this._playerAction = undefined;
    }
  }

  export class ActionListElementGUI {
    static readonly _elementClass: string = "action_list_element";
    static readonly _dragObjType: string = "action";
    static readonly _dragProperties: string[] = [
      "width",
      "height",
      "border",
      "backgroundColor",
      "display",
    ];
    private _action: Action.Action;
    private _div: JQuery<HTMLElement>;
    get action(): Action.Action {
      return this._action;
    }
    set action(a: Action.Action) {
      this._action = a;
      this.display();
    }
    constructor(parent: JQuery<HTMLElement>) {
      this._div = JQueryUtils.createDiv({
        htmlClass: ActionListElementGUI._elementClass,
        parent: parent,
      });
      this.setUpEventListeners();
    }
    private setUpEventListeners() {
      this._div.on("mousedown", (e) => this.onMouseDown(e.originalEvent));
    }
    // TODO: change this to work better!
    display(): void {
      this._div.html(this.repr());
    }
    repr(): string {
      return this._action != null ? this._action.name : "";
    }
    setHeight(height: number) {
      this._div.css(
        "height",
        height - 2 * Number(this._div.css("border-width").slice(0, -2)) + "px"
      );
    }

    // TODO: Maybe Don't use inner html object!
    onMouseDown(e: MouseEvent): void {
      if (!DragAPI.dragging && this.action != null) {
        let left: number = this._div[0].getBoundingClientRect().left - 8;
        let top: number = this._div[0].getBoundingClientRect().top - 52;
        this.setUpDragObject(left, top);
        DragAPI.startDrag(
          ActionListElementGUI._dragObjType,
          this.action.save(),
          e,
          true
        );
      }
    }
    // TODO: Don't use inner html object!
    setUpDragObject(left: number, top: number): void {
      let styleSheet = getComputedStyle(this._div[0]);
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
    private _elements: Action.Action[] = [];
    private _currentPage: number;
    private _div: JQuery<HTMLElement>;

    constructor(
      parent: JQuery<HTMLElement>,
      id: string,
      elementsPerPage: number
    ) {
      this._div = JQueryUtils.createDiv({ htmlID: id, parent: parent });
      this.elementsPerPage = elementsPerPage;
      this._currentPage = 0;
    }
    // TODO: Maybe don't use the inner html element
    set elementsPerPage(nr: number) {
      if (nr != this._listElements.length) {
        while (this._listElements.length < nr) {
          this._listElements.push(new ActionListElementGUI(this._div));
        }
        while (this._listElements.length > nr) {
          this._listElements.pop();
        }
        let height: number =
          this._div[0].clientHeight / this._listElements.length;
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
    set elements(actions: Action.Action[]) {
      this._elements = actions;
    }
    nextPage(): void {
      if (this.currentPage < this.nrPages) {
        this._currentPage++;
      }
    }
    getElementOnCurrentPage(i: number): Action.Action {
      let ind: number = this._currentPage * this._listElements.length + i;
      if (i > this.elementsPerPage || ind >= this._elements.length) {
        throw "ListGUI ERROR: Element requested not in list!";
      }
      return this._elements[ind];
    }
    addToEnd(elem: Action.Action): void {
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

    private _div: JQuery<HTMLElement>;
    private _spellActionList: ActionListGUI;
    private _otherActionList: ActionListGUI;
    private _areaGridGUI: ActionBarAreaGridGUI;

    constructor(parent: JQuery<HTMLElement>) {
      if (ActionBarGUI._nrInstances > 0) {
        throw "InfoBarGUI already has an instance running!";
      }
      ActionBarGUI._nrInstances += 1;
      ActionBarGUI._self = this;
      this._div = JQueryUtils.createDiv({
        htmlID: ActionBarGUI._divID,
        parent: parent,
      });

      this._spellActionList = new ActionListGUI(
        this._div,
        "FSActionBarSpellActions",
        ActionBarGUI._nrElementsPerList
      );
      this._areaGridGUI = new ActionBarAreaGridGUI(this._div);
      this._otherActionList = new ActionListGUI(
        this._div,
        "FSActionBarOtherActions",
        ActionBarGUI._nrElementsPerList
      );
      this._otherActionList.elements = Action.player_actions;

      this.update();
    }
    update(): void {
      this._spellActionList.update();
      this._otherActionList.update();
    }
    endPlayerTurn(): void {
      // activate on stay effects
      this._areaGridGUI.endPlayerTurn();
    }
    setUpFightBoard(fightInstance: FightInstance): void {
      this._areaGridGUI.setUpFightBoard(fightInstance);
    }
  }
}
