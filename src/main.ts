/// <reference path="logic/common.ts" />
/// <reference path="logic/fight.ts" />
/// <reference path="controller/fight_controller.ts" />

/// <reference path="controller/game_controller.ts" />

GameController.init();

let f = new Fight(
  ["Goblin", "Goblin", "Goblin"],
  new FightBoardTemplate(
    GrassTile.factory.instanciate(),
    [
      new TileWithPosition(1, 1, DangerTile.factory.instanciate()),
      new TileWithPosition(1, 2, DangerTile.factory.instanciate()),
      new TileWithPosition(1, 3, DangerTile.factory.instanciate()),
      new TileWithPosition(4, 4, DangerTile.factory.instanciate()),
    ],
    [new Pos(2, 2), new Pos(2, 3), new Pos(2, 4)]
  )
);
let fI = f.createFightInstance(1, GameController.player, new Pos(4, 4));
FightScreenController.setUpFight(fI);
