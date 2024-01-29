/// <reference path="logic/common.ts" />
/// <reference path="logic/fight.ts" />
/// <reference path="controller/fight_controller.ts" />

/// <reference path="controller/game_controller.ts" />

GameController.init();

let f = new Fight(
  ["Goblin", "Goblin", "Goblin"],
  new FightBoardTemplate(new PassableTile("#002000"), [
    new TileWithPosition(1, 1, new EnemyTile()),
    new TileWithPosition(1, 2, new EnemyTile()),
    new TileWithPosition(1, 3, new EnemyTile()),
  ])
);
let fI = f.createFightInstance(1, GameController.player, new Pos(4, 4));
FightScreenController.setUpFight(fI);
