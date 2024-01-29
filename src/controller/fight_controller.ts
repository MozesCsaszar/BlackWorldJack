/// <reference path="../GUI/fight/main.ts" />

class FightScreenController {
  static _fightScreenGUI: FightScreenGUI;
  private static _initialized: boolean = false;
  private static _fightInstance: FightInstance = undefined;
  static init(): void {
    if (this._initialized) {
      throw "ERROR: FightScreenController can only be initialized once!";
    }
    this._initialized = true;
    this._fightScreenGUI = new FightScreenGUI();
  }
  static setUpFight(fightInstance: FightInstance): void {
    this._fightInstance = fightInstance;
    this._fightScreenGUI.setUpFight(this._fightInstance);
  }
}
