/// <reference path="../GUI/fight/main.ts" />

class FightScreenController {
  static readonly divId = "FightScreen";
  static _fightScreenGUI: FightScreenGUI;
  private static _initialized: boolean = false;
  static fightInstance: FightInstance = undefined;
  static init(parent: JQuery<HTMLElement>): void {
    if (this._initialized) {
      throw "ERROR: FightScreenController can only be initialized once!";
    }
    this._initialized = true;
    this._fightScreenGUI = new FightScreenGUI(parent);
  }
  static setUpFight(fightInstance: FightInstance): void {
    this.fightInstance = fightInstance;
    this._fightScreenGUI.setUpFight(this.fightInstance);
  }
}
