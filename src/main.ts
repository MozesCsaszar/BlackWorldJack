/// <reference path="logic/common.ts" />
/// <reference path="logic/fight.ts" />
/// <reference path="controller/fight_controller.ts" />

/// <reference path="controller/game_controller.ts" />

// make sure that the document is ready for manipulation
$(function () {
  GameController.init();

  let f = new Fight(
    [],
    new FightBoardTemplate(GrassTile.factory.instanciate(), [], [])
  );
  let fI = f.createFightInstance(1, GameController.player, new Pos(2, 1));
  FightScreenController.setUpFight(fI);
});
