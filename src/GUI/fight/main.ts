/// <reference path="info_bar.ts" />
/// <reference path="action_bar.ts" />
/// <reference path="action_plan_bar.ts" />

class FightScreenGUI {
  static readonly _divID: string = "FightScreen";

  private static _self: FightScreenGUI;

  static get fullPath(): string {
    return "#" + FightScreenGUI._divID;
  }
  static endPlayerTurn(): void {
    this._self.endPlayerTurn();
  }

  private _div: JQuery<HTMLElement>;
  private _infoBarGUI: InfoBarGUIs.InfoBarGUI;
  private _actionBarGUI: ActionBarGUIs.ActionBarGUI;
  private _actionPlanBarGUI: ActionPlanBarGUIs.ActionPlanBarGUI;

  constructor(parent: JQuery<HTMLElement>) {
    FightScreenGUI._self = this;
    this._div = JQueryUtils.createDiv({
      htmlID: FightScreenGUI._divID,
      parent: parent,
    });
    this._infoBarGUI = new InfoBarGUIs.InfoBarGUI(this._div);
    this._actionBarGUI = new ActionBarGUIs.ActionBarGUI(this._div);
    this._actionPlanBarGUI = new ActionPlanBarGUIs.ActionPlanBarGUI(this._div);
    this.setUpEventListeners();
  }
  private setUpEventListeners(): void {
    this._div.on("mousemove", (e) => this.onMouseMove(e.originalEvent));
  }
  setUpFight(fightInstance: FightInstance) {
    this._infoBarGUI.setUpFight(fightInstance);
    this._actionBarGUI.setUpFightBoard(fightInstance);
    this._actionPlanBarGUI.setUpFight(fightInstance);
  }
  private onMouseMove(e: MouseEvent): void {
    if (DragAPI.dragging) {
      DragAPI.moveWithMouse(e);
    }
  }
  private endPlayerTurn(): void {
    // apply effects to player from board
    this._actionBarGUI.endPlayerTurn();
    // update info bar
    this._infoBarGUI.endPlayerTurn();
    // update actions
    this._actionPlanBarGUI.endPlayerTurn();
  }
}
