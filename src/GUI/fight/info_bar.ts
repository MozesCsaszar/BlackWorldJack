namespace InfoBarGUIs {
  class InfoBarStatusBarsGUI {
    static readonly _divID: string = "FSInfoBarStatusBars";
    private static _nrInstances: number = 0;

    private _div: JQuery<HTMLElement>;
    constructor(parent: JQuery<HTMLElement>) {
      if (InfoBarStatusBarsGUI._nrInstances > 0) {
        throw "InfoBarStatusBarsGUI already has an instance running!";
      }
      InfoBarStatusBarsGUI._nrInstances += 1;
      this._div = JQueryUtils.createDiv({
        htmlID: InfoBarStatusBarsGUI._divID,
        parent: parent,
      });
    }
    endPlayerTurn() {}
  }

  class EnemyGridGUI {
    static readonly _divClass: string = ".enemy_cell";

    private static _divDisplay: string = null;

    private _div: HTMLElement;
    private _enemy: Enemy.EnemyWithLevel;
    private _symbol: HTMLElement;
    private _name: HTMLElement;
    private _desc: HTMLElement;
    private _mods: HTMLElement;
    constructor(div: HTMLElement) {
      this._div = div;
      if (EnemyGridGUI._divDisplay == null) {
        EnemyGridGUI._divDisplay = this._div.style.display;
      }
      this._symbol = this._div.childNodes[1].childNodes[1] as HTMLElement;
      this._name = this._div.childNodes[1].childNodes[3] as HTMLElement;
      this._desc = this._div.childNodes[3] as HTMLElement;
      this._mods = this._div.childNodes[5] as HTMLElement;
    }
    setEnemy(enemy: Enemy.EnemyWithLevel) {
      this._enemy = enemy;
      if (enemy == undefined) {
        this.hide();
      } else {
        this.show();
      }
    }
    show() {
      this.updateGUI();
      this._div.style.display = EnemyGridGUI._divDisplay;
    }
    hide() {
      this.updateGUI();
      this._div.style.display = "none";
    }
    updateGUI() {
      // if (this._enemy == undefined) {
      //   this._symbol.innerHTML = "";
      //   this._name.innerHTML = "";
      //   this._desc.innerHTML = "";
      //   this._mods.innerHTML = "";
      // } else {
      //   this._symbol.innerHTML = this._enemy.symbol;
      //   this._name.innerHTML = this._enemy.name;
      //   this._desc.innerHTML = this._enemy.isAlive()
      //     ? this._enemy.getHTMLText()
      //     : "DEAD";
      //   this._mods.innerHTML = "";
      // }
    }
  }

  class TimerGridStopPlanningGUI {
    static readonly _divClass: string = "end_planning";
    static get classFullPath(): string {
      return EnemyGridTimerGridGUI.fullPath + ">" + this._divClass;
    }
    private _div: JQuery<HTMLElement>;
    constructor(parent: JQuery<HTMLElement>) {
      this._div = JQueryUtils.createDiv({
        htmlClass: TimerGridStopPlanningGUI._divClass,
        parent: parent,
      });
      this.setUpEventListeners();
    }
    private setUpEventListeners() {
      this._div.on("mousedown", (e) => this.onMouseDown(e.originalEvent));
    }
    onMouseDown(e: MouseEvent) {
      FightScreenGUI.endPlayerTurn();
    }
  }

  class TimerGridTimerGUI {
    static readonly _divClass: string = "timer";

    private _timer: number;
    private _timerIntervalID: number = null;
    static get fullPath(): string {
      return EnemyGridTimerGridGUI.fullPath + ">" + this._divClass;
    }

    private _div: JQuery<HTMLElement>;
    constructor(parent: JQuery<HTMLElement>) {
      this._div = JQueryUtils.createDiv({
        htmlClass: TimerGridTimerGUI._divClass,
        parent: parent,
      });
    }
    setTime(sep: string = ":") {
      let time: number = this._timer;
      let msec: string = (time % 1000).toString();
      msec = StringUtil.padRightUntilLength(msec, 3, "0");
      time = Math.floor(time / 1000);
      let sec: string = (time % 60).toString();
      sec = StringUtil.padRightUntilLength(sec, 2, "0");
      time = Math.floor(time / 60);
      let min: string = (time % 60).toString();
      min = StringUtil.padRightUntilLength(min, 2, "0");
      this._div.html(min + sep + sec + sep + msec);
    }
    resetTimer(time: number): void {
      this._timer = time;
    }
    stopTimer(): void {
      if (this._timerIntervalID != null) {
        clearInterval(this._timerIntervalID);
        this._timerIntervalID = null;
      }
    }
    startTimer(): void {
      if (this._timerIntervalID == null) {
        this._timerIntervalID = setInterval(() => {
          this._timer -= 33;
          this.setTime();
        }, 33);
      }
    }
  }

  class EnemyGridTimerGridGUI {
    static readonly _divClass: string = "plan_countdown";
    static get fullPath(): string {
      return InfoBarEnemyGridGUI.fullPath + ">" + this._divClass;
    }

    private _div: JQuery<HTMLElement>;
    private _stopPlanningGUIs: TimerGridStopPlanningGUI[] = [];
    private _timerGUI: TimerGridTimerGUI;
    private _maxTime: number = 30 * 1000;
    constructor(parent: JQuery<HTMLElement>) {
      this._div = JQueryUtils.createDiv({
        htmlClass: EnemyGridTimerGridGUI._divClass,
        parent: parent,
      });

      this._stopPlanningGUIs.push(new TimerGridStopPlanningGUI(this._div));
      this._timerGUI = new TimerGridTimerGUI(this._div);
      this._stopPlanningGUIs.push(new TimerGridStopPlanningGUI(this._div));

      this.setUp();
    }
    setUp() {
      this.reset();
      this._timerGUI.startTimer();
      this.update();
    }
    reset() {
      this._timerGUI.resetTimer(this._maxTime);
    }
    endPlayerTurn() {
      this._maxTime -= 500;
      this._timerGUI.resetTimer(this._maxTime);
    }
    update() {}
  }

  class InfoBarEnemyGridGUI {
    static readonly _divID: string = "FSInfoBarEnemyGrid";
    private static _nrInstances: number = 0;
    private static _nrEnemyGridGUIs = 1;

    static get fullPath(): string {
      return InfoBarGUI.fullPath + ">#" + InfoBarEnemyGridGUI._divID;
    }

    private _div: JQuery<HTMLElement>;
    private _enemyGrindGUIs: EnemyGridGUI[] = [];
    private _timerGridGUI: EnemyGridTimerGridGUI;
    constructor(parent: JQuery<HTMLElement>) {
      if (InfoBarEnemyGridGUI._nrInstances > 0) {
        throw "InfoBarEnemyGridGUI already has an instance running!";
      }
      InfoBarEnemyGridGUI._nrInstances += 1;

      this._div = JQueryUtils.createDiv({
        htmlID: InfoBarEnemyGridGUI._divID,
        parent: parent,
      });

      // document
      //   .querySelectorAll(
      //     InfoBarEnemyGridGUI.fullPath + ">" + EnemyGridGUI._divClass
      //   )
      //   .forEach((e) =>
      //     this._enemyGrindGUIs.push(new EnemyGridGUI(e as HTMLElement))
      //   );
      this._timerGridGUI = new EnemyGridTimerGridGUI(this._div);
      this.update();
    }
    update() {
      this._enemyGrindGUIs.forEach((e, i) => {
        i < InfoBarEnemyGridGUI._nrEnemyGridGUIs ? e.show() : e.hide();
      });
    }
    setUpFight(fightInstance: FightInstance) {
      fightInstance.enemies.forEach((e, i) =>
        this._enemyGrindGUIs[i].setEnemy(e)
      );
      InfoBarEnemyGridGUI._nrEnemyGridGUIs = fightInstance.enemies.length;
    }
    resetTimer() {
      this._timerGridGUI.reset();
    }
    endPlayerTurn() {
      this._timerGridGUI.endPlayerTurn();
    }
  }

  class InfoBarPlayerInfoGUI {
    static readonly _divID: string = "FSInfoBarPlayerInfo";
    private static _nrInstances: number = 0;

    private _div: JQuery<HTMLElement>;
    constructor(parent: JQuery<HTMLElement>) {
      if (InfoBarPlayerInfoGUI._nrInstances > 0) {
        throw "InfoBarPlayerInfoGUI already has an instance running!";
      }
      InfoBarPlayerInfoGUI._nrInstances += 1;
      this._div = JQueryUtils.createDiv({
        htmlID: InfoBarPlayerInfoGUI._divID,
        parent: parent,
      });
    }
    display() {}
    update() {
      this.display();
    }
    endPlayerTurn() {
      this.display();
    }
  }

  export class InfoBarGUI {
    static readonly _divID: string = "FightScreenInfoBar";
    static self: InfoBarGUI;
    private static _nrInstances: number = 0;

    static get fullPath() {
      return FightScreenGUI.fullPath + ">#" + InfoBarGUI._divID;
    }

    private _div: JQuery<HTMLElement>;
    private _statusBarsGUI: InfoBarStatusBarsGUI;
    private _enemyGridGUI: InfoBarEnemyGridGUI;
    private _playerInfoGUI: InfoBarPlayerInfoGUI;
    constructor(parent: JQuery<HTMLElement>) {
      if (InfoBarGUI._nrInstances > 0) {
        throw "InfoBarGUI already has an instance running!";
      }
      InfoBarGUI._nrInstances += 1;
      InfoBarGUI.self = this;
      this._div = JQueryUtils.createDiv({
        htmlID: InfoBarGUI._divID,
        parent: parent,
      });
      this._statusBarsGUI = new InfoBarStatusBarsGUI(this._div);
      this._enemyGridGUI = new InfoBarEnemyGridGUI(this._div);
      this._playerInfoGUI = new InfoBarPlayerInfoGUI(this._div);
    }
    endPlayerTurn(): void {
      this._statusBarsGUI.endPlayerTurn();
      this._enemyGridGUI.endPlayerTurn();
      this._playerInfoGUI.endPlayerTurn();
    }
    update(): void {
      this._playerInfoGUI.update();
      this._enemyGridGUI.update();
    }
    setUpFight(fightInstance: FightInstance): void {
      this._enemyGridGUI.setUpFight(fightInstance);
      this._playerInfoGUI.display();
    }
  }
}
