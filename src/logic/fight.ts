interface FightBoardTile {
  repr(contentRepr: string): string;
  get type(): string;
  copy(): FightBoardTile;
}

class PassableTile implements FightBoardTile {
  private _backgroundColor: string;
  get type(): string {
    return "PassableTile";
  }
  constructor(backgroundColor: string) {
    this._backgroundColor = backgroundColor;
  }
  repr(contentRepr: string = ""): string {
    return (
      '<div style="background-color: ' +
      this._backgroundColor +
      '; width: 100%; height: 100%">' +
      contentRepr +
      "</div>"
    );
  }
  copy(): PassableTile {
    return new PassableTile(this._backgroundColor);
  }
}

class EnemyTile implements FightBoardTile {
  private _backgroundTile: FightBoardTile;
  get type(): string {
    return "EnemyTile";
  }
  get backgroundTile(): FightBoardTile {
    return this._backgroundTile;
  }
  constructor(backgroundTile: FightBoardTile = undefined) {
    this._backgroundTile = backgroundTile;
  }
  setBackgroundTile(tile: FightBoardTile): void {
    if (this._backgroundTile == undefined) {
      this._backgroundTile = tile;
    } else {
      throw "ERROR: Cannot set background tile of EnemyTile when it is not unknown!";
    }
  }
  repr(contentRepr: string = ""): string {
    return this._backgroundTile.repr(contentRepr);
  }
  copy(): EnemyTile {
    return new EnemyTile(this.backgroundTile);
  }
}

class TileWithPosition {
  private _row: number;
  private _col: number;
  private _tile: FightBoardTile;
  get row(): number {
    return this._row;
  }
  get col(): number {
    return this._col;
  }
  get tile(): FightBoardTile {
    return this._tile;
  }
  constructor(row: number, col: number, tile: FightBoardTile) {
    this._row = row;
    this._col = col;
    this._tile = tile;
  }
  copy(): TileWithPosition {
    return new TileWithPosition(this._row, this._col, this._tile.copy());
  }
}

class FightBoardTemplate {
  private _defTile: FightBoardTile;
  private _tiles: TileWithPosition[] = [];
  get tiles(): readonly TileWithPosition[] {
    return this._tiles;
  }
  get defaultTile(): FightBoardTile {
    return this._defTile;
  }
  constructor(defTile: FightBoardTile, tiles: TileWithPosition[] = []) {
    this._defTile = defTile;
    tiles.forEach((e) => {
      this._tiles.push(e.copy());
    });
  }
  copy(): FightBoardTemplate {
    return new FightBoardTemplate(this._defTile, this._tiles);
  }
}

class FightBoard {
  private _baseLayer: FightBoardTile[][] = [];
  private _enemyLayer: Enemy.EnemyWithLevel[][] = [];
  private _width: number;
  private _height: number;
  private _enemySpawnTiles: Pos[] = [];
  private _playerPos: Pos;
  get playerPos(): Pos {
    return this._playerPos;
  }
  get baseLayer(): readonly FightBoardTile[][] {
    return this._baseLayer;
  }
  get enemyLayer(): readonly Enemy.EnemyWithLevel[][] {
    return this._enemyLayer;
  }
  constructor(width: number, height: number) {
    for (let i = 0; i < height; i++) {
      this._baseLayer[i] = [];
      this._enemyLayer[i] = [];
    }
    this._width = width;
    this._height = height;
  }
  setUpFromTemplate(template: FightBoardTemplate) {
    let templated: boolean[][] = [];
    this._enemySpawnTiles = [];
    for (let i = 0; i < this._height; i++) {
      templated.push([]);
      for (let j = 0; j < this._width; j++) {
        templated[i].push(false);
      }
    }
    template.tiles.forEach((e) => {
      this._baseLayer[e.row][e.col] = e.tile.copy();
      templated[e.row][e.col] = true;
      if (e.tile.type == "EnemyTile") {
        this._enemySpawnTiles.push(new Pos(e.col, e.row));
        let t: EnemyTile = e.tile as EnemyTile;
        if (t.backgroundTile == undefined) {
          t.setBackgroundTile(template.defaultTile.copy());
        }
        this._baseLayer[e.row][e.col] = t;
      }
    });
    for (let i = 0; i < this._height; i++) {
      for (let j = 0; j < this._width; j++) {
        if (!templated[i][j]) {
          this._baseLayer[i][j] = template.defaultTile.copy();
        }
      }
    }
  }
  setUpEnemies(enemies: Enemy.EnemyWithLevel[]) {
    enemies.forEach((e) => {
      let r: number = MathUtil.getRandomIntBelow(this._enemySpawnTiles.length);
      let place: Pos = this._enemySpawnTiles[r];
      this._enemyLayer[place.y][place.x] = e;
      e.pos = place;
      this._enemySpawnTiles[r] =
        this._enemySpawnTiles[this._enemySpawnTiles.length - 1];
      this._enemySpawnTiles.pop();
    });
  }
  setUpPlayer(playerPos: Pos) {
    this._playerPos = playerPos;
  }
}

class FightPlayer {
  private _player: Player;
  private _actionsTaken: number[] = [];
  private _actions: Action.PlayerAction[];

  get player() {
    return this._player;
  }
  get actions() {
    return this._actions;
  }
  constructor(player: Player) {
    this._player = player;
    this._actions = Action.player_actions;
  }
}

class FightInstance {
  private _enemies: Enemy.EnemyWithLevel[] = [];
  private _fightBoard: FightBoard;
  private _player: FightPlayer;
  private _playerPos: Pos;
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
    return this._playerPos;
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
    this._fightBoard.setUpPlayer(this.playerPos);
  }
  addEnemy(e: Enemy.EnemyWithLevel) {
    e.symbol = String(this._enemies.length + 1);
    this._enemies.push(e);
  }
  addPlayer(player: Player, playerPos: Pos) {
    this._player = new FightPlayer(player);
    this._playerPos = playerPos;
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
