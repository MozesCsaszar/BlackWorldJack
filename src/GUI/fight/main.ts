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

  private _div: HTMLElement;
  private _infoBarGUI: InfoBarGUIs.InfoBarGUI;
  private _actionBarGUI: ActionBarGUIs.ActionBarGUI;
  private _actionPlanBarGUI: ActionPlanBarGUIs.ActionPlanBarGUI;
  constructor() {
    FightScreenGUI._self = this;
    this._div = document.getElementById(FightScreenGUI._divID);
    this._infoBarGUI = new InfoBarGUIs.InfoBarGUI();
    this._actionBarGUI = new ActionBarGUIs.ActionBarGUI();
    this._actionPlanBarGUI = new ActionPlanBarGUIs.ActionPlanBarGUI();
    this.setUpEventListeners();
  }
  private setUpEventListeners(): void {
    let c_obj: FightScreenGUI = this;
    this._div.addEventListener("mousemove", (e: MouseEvent) =>
      c_obj.onMouseMove(e, c_obj)
    );
  }
  setUpFight(fightInstance: FightInstance) {
    this._infoBarGUI.setUpFight(fightInstance);
    this._actionBarGUI.setUpFightBoard(fightInstance);
    this._actionPlanBarGUI.setUpFight(fightInstance);
  }
  private onMouseMove(e: MouseEvent, c_obj: FightScreenGUI): void {
    if (DragAPI.dragging) {
      DragAPI.moveWithMouse(e);
    }
  }
  private endPlayerTurn(): void {
    // apply effects to player from board
    this._actionBarGUI.endPlayerTurn();
    // refresh info bar
    this._infoBarGUI.endPlayerTurn();
    // refresh actions
    this._actionPlanBarGUI.endPlayerTurn();
  }
}
