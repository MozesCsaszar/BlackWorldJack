/// <reference path="common.ts" />

namespace Enemy {
  enum Modifier {}

  class Scaling {
    copy(): Scaling {
      return new Scaling();
    }
  }
  class EnemyAI {
    playerActions: Action.Action[] = [];
    nrPlayerActions: number;
    actions: Action.Action[];
    nrActions: number;
    speed: number;
    intelligence: number;
    thinkingSpeed: number;
    agression: number;
    fear: number;
    memory: number;
    /**
     * @param actions what moves the AI can take
     * @param nrActions how many actions the enemy can take in a turn
     * @param speed how quickly it activates
     * @param intelligence how good it is in choosing the best solution from the available ones
     * @param thinkingSpeed how many player reactions it can take into consideration
     * @param agression how much it values dealing damage
     * @param fear how much it fears taking damage
     * @param memory how quickly does it figure out the player's moves
     */
    constructor(
      actions: Action.Action[],
      nrActions: number,
      speed: number,
      intelligence: number,
      thinkingSpeed: number,
      agression: number,
      fear: number,
      memory: number
    ) {
      this.actions = actions;
      this.nrActions = nrActions;
      this.speed = speed;
      this.intelligence = intelligence;
      this.thinkingSpeed = thinkingSpeed;
      this.agression = agression;
      this.fear = fear;
      this.memory = memory;
    }
    /**
     * Get the action the enemy will take
     */
    getActions(fightBoard: FightBoard, player: FightPlayer): Action.Action[] {
      return this._chooseAction(this._getActionScores(fightBoard, player));
    }
    /**
     * Get the possible moves and their scores
     */
    private _getActionScores(
      fightBoard: FightBoard,
      player: FightPlayer
    ): Map<number, number[][]> {
      let result = new Map<number, number[][]>();
      // get all the possible moves for the enemy
      let array = Array.from(
        { length: this.actions.length },
        (_, index) => index
      );
      let moves = Array.from(
        MathUtil.generateCombinations(array, this.nrActions)
      );
      // get all the possible moves for the player, as predicted by this enemy
      let playerArray = Array.from(
        { length: this.playerActions.length },
        (_, index) => index
      );
      let playerMoves = [];
      MathUtil.shuffleArray(playerArray);
      for (let i = 0; i < this.thinkingSpeed; i++) {
        playerMoves.push(
          MathUtil.generateCombinations(playerArray, this.nrPlayerActions)
        );
      }
      // simulate all the combinations

      return result;
    }
    /**
     * Find out the score of an action
     */
    private _getActionScore(
      startingPlayer: FightPlayer,
      currentPlayer: FightPlayer,
      startingSelf: EnemyWithLevel,
      currentSelf: EnemyWithLevel
    ): number {
      return 0;
    }
    // TODO: Implement this with actual choice
    /**
     * Choose a move based on score and intelligence
     */
    private _chooseAction(actions: Map<number, number[][]>): Action.Action[] {
      let scores = Array.from(actions.keys()).sort((a, b) => b - a);
      return actions.get(scores[0])[0].map((e) => this.actions[e]);
    }
  }

  class EnemyBody {
    private _attributes: EntityStats;
    private _modifiers: Modifier[] = [];

    get attributes(): EntityStats {
      return this._attributes;
    }
    constructor(attributes: EntityStats, modifiers: Modifier[]) {
      this._attributes = attributes.copy();
      modifiers.forEach((e) => this._modifiers.push(e));
    }

    copy(): EnemyBody {
      return new EnemyBody(this._attributes, this._modifiers);
    }
  }

  class EnemyInfo {
    name: string;
    desc: string;
    constructor(name: string, desc: string) {
      this.name = name;
      this.desc = desc;
    }
  }

  export class EnemyWithLevel extends IEntity {
    private _body: EnemyBody;
    //private _elitenessModifiers: EnemyBody[] = [];
    private _symbol: string;
    private _level: number;
    private _info: EnemyInfo;
    get level(): number {
      return this._level;
    }
    get name(): string {
      return this._info.name;
    }
    get desc(): string {
      return this._info.desc;
    }
    get symbol(): string {
      return this._symbol;
    }
    set enemyInfo(info: EnemyInfo) {
      this._info = info;
    }
    set symbol(sym: string) {
      this._symbol = sym;
    }
    set pos(position: Pos) {
      this._pos = position;
    }
    constructor(body: EnemyBody, level: number) {
      super(body.attributes);

      this._body = body.copy();
      this._level = level;
    }
    copy(): EnemyWithLevel {
      let e: EnemyWithLevel = new EnemyWithLevel(
        this._body.copy(),
        this._level
      );
      e.enemyInfo = this._info;
      return e;
    }
    getHTMLText(): string {
      return this._baseStats.getHTMLText();
    }
  }

  export class Enemy {
    static copy(enemy: Enemy) {
      return enemy.copy();
    }
    private _name: string;
    private _desc: string;

    private _levels: Map<number, EnemyWithLevel> = new Map<
      number,
      EnemyWithLevel
    >();
    private _scaling: Scaling;

    constructor(
      name: string,
      desc: string,
      levels: Map<number, EnemyWithLevel>,
      scaling: Scaling = undefined
    ) {
      this._name = name;
      this._desc = desc;
      levels.forEach((e, k) => {
        e.enemyInfo = this.getInfo();
        this._levels.set(k, e.copy());
      });
      this._scaling = scaling == undefined ? undefined : scaling.copy();
    }
    copy(): Enemy {
      let e: Enemy = new Enemy(
        this._name,
        this._desc,
        this._levels,
        this._scaling == undefined ? undefined : this._scaling.copy()
      );
      return e;
    }
    getEnemyWithLevel(level: number): EnemyWithLevel {
      if (level >= 1) {
        if (this._levels.get(level) != undefined) {
          return this._levels.get(level).copy();
        } else {
          /*Cases:
                          I:      There is an enemy with lower level and scaling     -> Scale enemy from lower level
                          II:     There is an enemy with higher level and no scaling -> Get enemy from higher level
                          III:    There is no enemy with higher level and no scaling -> Throw error
                      */
          let tempLevels: number[] = [];
          for (const level of this._levels.keys()) {
            tempLevels.push(level);
          }
          tempLevels = tempLevels.sort();
          if (this._scaling != undefined) {
            return this._levels.get(0).copy();
          } else {
            let higher: number = undefined;
            tempLevels.forEach((e) => {
              if (e > level) {
                if (higher == undefined) {
                  higher = e;
                }
              }
            });
            if (higher == undefined) {
              throw "ERROR: No higher level enemy to initialize this one!";
            } else {
              return this._levels.get(higher).copy();
            }
          }
        }
      } else {
        throw "ERROR: Cannot copy Enemy with level < 1";
      }
    }
    getInfo(): EnemyInfo {
      return new EnemyInfo(this._name, this._desc);
    }
  }

  export let enemies = {
    Goblin: new Enemy(
      "Goblin",
      "Stinky and foul looking, these creatures are not the bestest fighters.",
      new Map<number, EnemyWithLevel>([
        [
          1,
          new EnemyWithLevel(
            new EnemyBody(
              new EntityStats(
                1,
                new ElementalAttributes(),
                new ElementalAttributes(3),
                new ElementalAttributes()
              ),
              []
            ),
            1
          ),
        ],
      ])
    ),
  };
}
