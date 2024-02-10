/// <reference path="../GUI/common.ts" />

interface IAffectable {}

interface IEffect {
  apply(affectable: IAffectable): void;
  undo(affectable: IAffectable): void;
  copy(): IEffect;
}

interface IEntityEffect extends IEffect {
  apply(affectable: IEntity): void;
  undo(affectable: IEntity): void;
}

class EntityDamageEffect implements IEntityEffect {
  damageDone: number = 0;
  damage: ElementalAttributes;

  constructor(damage: ElementalAttributes) {
    this.damage = damage;
  }

  apply(affectable: IEntity): void {
    this.damageDone = affectable.takeDamage(this.damage);
    console.log(`Damage done: ${this.damageDone}`);
  }
  undo(affectable: IEntity): void {
    affectable.health += this.damageDone;
  }
  copy(): EntityDamageEffect {
    return new EntityDamageEffect(this.damage.copy());
  }
}

interface ITileEffect {
  apply(affectable: ATile): void;
  undo(affectable: ATile): void;
}

interface ITileObject extends IAffectable {}

class OnTileEntity {
  entity: IEntity;
  nrRounds: number;

  constructor(entity: IEntity, nrRounds: number = 0) {
    this.entity = entity;
    this.nrRounds = nrRounds;
  }

  newRound(): void {
    this.nrRounds++;
  }
}

/**
 * On tile effects should be immutable!
 */
abstract class ATile implements IAffectable {
  backgroundStye: ElementStyle;
  objects: ITileObject[] = [];
  onEnterEffects: IEffect[];
  onStayEffects: IEffect[];
  onExitEffects: IEffect[];
  entities: OnTileEntity[] = [];
  passable: boolean;

  constructor(
    backgroundStyle: ElementStyle,
    onEnterEffects: IEffect[] = [],
    onStayEffects: IEffect[] = [],
    onExitEffects: IEffect[] = []
  ) {
    this.backgroundStye = backgroundStyle;
    this.onEnterEffects = onEnterEffects;
    this.onStayEffects = onStayEffects;
    this.onExitEffects = onExitEffects;
  }

  applyBackgroundStyle(
    element: HTMLElement,
    oldStyle: ElementStyle = new ElementStyle()
  ): void {
    this.backgroundStye.applyNewStyle(element, oldStyle);
  }

  abstract copy(): ATile;

  private _applyEffects(effects: IEffect[], affectable: IAffectable) {
    effects.forEach((effect) => {
      effect.apply(affectable);
    });
  }
  private _undoEffects(effects: IEffect[], affectable: IAffectable) {
    effects.forEach((effect) => {
      effect.undo(affectable);
    });
  }

  /**
   * Call when an entity enters the space
   */
  enter(affectable: IEntity) {
    this._applyEffects(this.onEnterEffects, affectable);
    // add entity to entities
    this.add(affectable);
  }
  /**
   * Call when an entity stays on the space
   */
  stay(affectable: IEntity) {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].entity == affectable) {
        if (this.entities[i].nrRounds > 0)
          this._applyEffects(this.onStayEffects, this.entities[i].entity);
        this.entities[i].nrRounds++;
      }
    }
  }
  /**
   * Call when an entity exits the space
   */
  exit(affectable: IEntity) {
    this._applyEffects(this.onExitEffects, affectable);
    // remove entity from entites
    this.remove(affectable);
  }

  /**
   * Add entity to the space without triggering onEnter effects
   */
  add(affectable: IEntity, nrRounds: number = 0) {
    this.entities.push(new OnTileEntity(affectable, nrRounds));
  }
  /**
   * Remove entity from the space without triggering onExit effects
   */
  remove(affectable: IEntity) {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].entity == affectable) {
        delete this.entities[i];
        break;
      }
    }
  }
}

interface ITileFactory {
  instanciate(
    onEnterEffects: IEffect[],
    onStayEffects: IEffect[],
    onExitEffects: IEffect[]
  ): ATile;
  instanciateCustom(
    onEnterEffects: IEffect[],
    onStayEffects: IEffect[],
    onExitEffects: IEffect[]
  ): ATile;
}

class GrassTileFactory implements ITileFactory {
  static backgroundStye: ElementStyle = new ElementStyle(
    new Map([["backgroundColor", "green"]])
  );
  static onEnterEffects: IEffect[] = [];
  static onStayEffects: IEffect[] = [];
  static onExitEffects: IEffect[] = [];
  instanciate(
    onEnterEffects: IEffect[] = [],
    onStayEffects: IEffect[] = [],
    onExitEffects: IEffect[] = []
  ): GrassTile {
    return new GrassTile(
      GrassTileFactory.backgroundStye,
      [...onEnterEffects, ...GrassTileFactory.onEnterEffects],
      [...onStayEffects, ...GrassTileFactory.onStayEffects],
      [...onExitEffects, ...GrassTileFactory.onExitEffects]
    );
  }
  instanciateCustom(
    onEnterEffects: IEffect[] = [],
    onStayEffects: IEffect[] = [],
    onExitEffects: IEffect[] = []
  ): ATile {
    return new GrassTile(
      GrassTileFactory.backgroundStye,
      onEnterEffects,
      onStayEffects,
      onExitEffects
    );
  }
}

class GrassTile extends ATile {
  static factory = new GrassTileFactory();

  copy(): GrassTile {
    return GrassTile.factory.instanciate();
  }
}

class DangerTileFactory implements ITileFactory {
  static backgroundStye: ElementStyle = new ElementStyle(
    new Map([["backgroundColor", "red"]])
  );
  static onEnterEffects: IEffect[] = [
    new EntityDamageEffect(new ElementalAttributes(1)),
  ];
  static onStayEffects: IEffect[] = [
    new EntityDamageEffect(new ElementalAttributes(1)),
  ];
  static onExitEffects: IEffect[] = [];
  instanciate(
    onEnterEffects: IEffect[] = [],
    onStayEffects: IEffect[] = [],
    onExitEffects: IEffect[] = []
  ): GrassTile {
    return new DangerTile(
      DangerTileFactory.backgroundStye,
      [...onEnterEffects, ...DangerTileFactory.onEnterEffects],
      [...onStayEffects, ...DangerTileFactory.onStayEffects],
      [...onExitEffects, ...DangerTileFactory.onExitEffects]
    );
  }
  instanciateCustom(
    onEnterEffects: IEffect[] = [],
    onStayEffects: IEffect[] = [],
    onExitEffects: IEffect[] = []
  ): ATile {
    return new DangerTile(
      DangerTileFactory.backgroundStye,
      onEnterEffects,
      onStayEffects,
      onExitEffects
    );
  }
}

class DangerTile extends ATile {
  static factory = new DangerTileFactory();

  copy(): DangerTile {
    return DangerTile.factory.instanciate();
  }
}

class TileWithPosition {
  private _row: number;
  private _col: number;
  private _tile: ATile;
  get row(): number {
    return this._row;
  }
  get col(): number {
    return this._col;
  }
  get tile(): ATile {
    return this._tile;
  }
  constructor(row: number, col: number, tile: ATile) {
    this._row = row;
    this._col = col;
    this._tile = tile;
  }
  copy(): TileWithPosition {
    return new TileWithPosition(this._row, this._col, this._tile.copy());
  }
}

/**
 * A class which helps you instantiate the fighting board; it's elements shouldn't be modified!
 */
class FightBoardTemplate {
  private _defaultTile: ATile;
  private _tiles: TileWithPosition[];
  private _enemySpawnPositions: Pos[];
  get tiles(): readonly TileWithPosition[] {
    return this._tiles;
  }
  get defaultTile(): ATile {
    return this._defaultTile;
  }
  get enemySpawnPositions(): Pos[] {
    return this._enemySpawnPositions;
  }
  constructor(
    defTile: ATile,
    tiles: TileWithPosition[] = [],
    enemySpawnPositions: Pos[] = []
  ) {
    this._defaultTile = defTile;
    this._enemySpawnPositions = enemySpawnPositions;
    this._tiles = tiles;
  }
  copy(): FightBoardTemplate {
    return new FightBoardTemplate(this._defaultTile, this._tiles);
  }
}

class FightBoard {
  private _tiles: ATile[][] = [];
  private _width: number;
  private _height: number;
  private _enemySpawnPositions: Pos[] = [];
  private _playerPos: Pos;
  get playerPos(): Pos {
    return this._playerPos;
  }
  get tiles(): ATile[][] {
    return this._tiles;
  }
  constructor(width: number, height: number) {
    for (let i = 0; i < height; i++) {
      this._tiles[i] = [];
    }
    this._width = width;
    this._height = height;
  }
  setUpFromTemplate(template: FightBoardTemplate) {
    let templated: boolean[][] = [];
    this._enemySpawnPositions = [];
    for (let i = 0; i < this._height; i++) {
      templated.push([]);
      for (let j = 0; j < this._width; j++) {
        templated[i].push(false);
      }
    }
    template.tiles.forEach((e) => {
      this._tiles[e.row][e.col] = e.tile.copy();
      templated[e.row][e.col] = true;
    });
    this._enemySpawnPositions = template.enemySpawnPositions;
    // fill in the rest with default tiles
    for (let i = 0; i < this._height; i++) {
      for (let j = 0; j < this._width; j++) {
        if (!templated[i][j]) {
          this._tiles[i][j] = template.defaultTile.copy();
        }
      }
    }
  }
  setUpEnemies(enemies: Enemy.EnemyWithLevel[]) {
    enemies.forEach((e) => {
      let r: number = MathUtil.getRandomIntBelow(
        this._enemySpawnPositions.length
      );
      let place: Pos = this._enemySpawnPositions[r];
      this._tiles[place.y][place.x].add(e, 1);
      e.pos = place;
      this._enemySpawnPositions[r] =
        this._enemySpawnPositions[this._enemySpawnPositions.length - 1];
      this._enemySpawnPositions.pop();
    });
  }
  setUpPlayer(playerPos: Pos, player: FightPlayer) {
    this._playerPos = playerPos;
    this._tiles[playerPos.y][playerPos.x].add(player.player, 1);
  }
}

class FightPlayer implements IAffectable {
  private _player: Player;
  private _actionsTaken: number[] = [];
  private _actions: Action.PlayerAction[];

  get player() {
    return this._player;
  }
  get actions() {
    return this._actions;
  }
  constructor(player: Player, playerPos: Pos) {
    this._player = player;
    this._player.pos = playerPos;
    this._actions = Action.player_actions;
  }
  getHTMLText(): string {
    return this.player.baseStats.getHTMLText();
  }
}

class FightInstance {
  private _enemies: Enemy.EnemyWithLevel[] = [];
  private _fightBoard: FightBoard;
  private _player: FightPlayer;
  private _playerTempPos: Pos;

  get enemies(): readonly Enemy.EnemyWithLevel[] {
    return this._enemies;
  }
  get fightBoard(): FightBoard {
    return this._fightBoard;
  }
  get player(): FightPlayer {
    return this._player;
  }
  get playerPos(): Pos {
    return this._player.player.pos;
  }
  get playerTempPos(): Pos {
    return this._playerTempPos;
  }
  setUpFightBoard(
    width: number,
    height: number,
    boardTemplate: FightBoardTemplate
  ) {
    this._fightBoard = new FightBoard(width, height);
    this._fightBoard.setUpFromTemplate(boardTemplate);
    this._fightBoard.setUpEnemies(this._enemies);
    this._fightBoard.setUpPlayer(this.playerPos, this._player);
  }
  addEnemy(e: Enemy.EnemyWithLevel) {
    e.symbol = String(this._enemies.length + 1);
    this._enemies.push(e);
  }
  addPlayer(player: Player, playerPos: Pos) {
    this._player = new FightPlayer(player, playerPos);
    this._playerTempPos = new Pos(playerPos.x, playerPos.y);
  }
}

class Fight {
  private _enemies: string[] = [];
  private _boardTemplate: FightBoardTemplate;

  constructor(enemyNames: string[], boardTemplate: FightBoardTemplate) {
    enemyNames.forEach((e) => this._enemies.push(e));
    this._boardTemplate = boardTemplate;
  }
  createFightInstance(
    level: number,
    player: Player,
    playerPos: Pos
  ): FightInstance {
    let fightInstance = new FightInstance();
    //Set up Entities: Enemies and Player
    this._enemies.forEach((e) =>
      fightInstance.addEnemy(
        GameController.getEnemyByName(e).getEnemyWithLevel(level)
      )
    );
    fightInstance.addPlayer(player, playerPos);

    //Set up the Board
    fightInstance.setUpFightBoard(8, 7, this._boardTemplate);
    return fightInstance;
  }
}
