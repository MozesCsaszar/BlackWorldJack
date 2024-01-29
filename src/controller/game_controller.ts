/// <reference path="../GUI/common.ts" />
/// <reference path="../logic/enemy.ts" />

class GameController {
  private static _initialized: boolean = false;
  private static _player: Player;

  static getEnemyByName(name: string): Enemy.Enemy {
    return Enemy.enemies[name];
  }
  static get player(): Player {
    return this._player;
  }

  private static initAPIs() {
    DragAPI.setUpEventListeners();
  }
  private static initControllers() {
    FightScreenController.init();
  }
  static init() {
    if (this._initialized) {
      throw "ERROR: GameController can only be initialized once!";
    }
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
    this.initAPIs();
    this.initControllers();
    this._player = new Player(
      new EntityStats(
        10,
        new ElementalAttributes(),
        new ElementalAttributes(3),
        new ElementalAttributes()
      ),
      2,
      1
    );
  }
}
